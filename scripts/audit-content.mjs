import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = join(root, 'docs')
const courseDataPath = join(docsRoot, '.vitepress', 'theme', 'course-data.ts')
const caseDataPath = join(docsRoot, '.vitepress', 'theme', 'case-data.ts')
const errors = []
const warnings = []

const courseSource = await readFile(courseDataPath, 'utf8')
const caseSource = await readFile(caseDataPath, 'utf8')
const lessonPattern =
  /lesson\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+)\)/g
const lessons = [...courseSource.matchAll(lessonPattern)].map((match) => ({
  id: match[1],
  stage: match[2],
  title: match[3],
  path: match[4],
  minutes: Number(match[5])
}))
const casePaths = new Set(
  [...caseSource.matchAll(/^\s*'([^']+\.md)':\s*\{/gm)].map((match) => match[1])
)

if (lessons.length === 0) errors.push('课程清单为空，无法进行审计')

const ids = new Set()
const paths = new Set()
for (const lesson of lessons) {
  if (ids.has(lesson.id)) errors.push(`重复课程 ID：${lesson.id}`)
  if (paths.has(lesson.path)) errors.push(`重复课程路径：${lesson.path}`)
  ids.add(lesson.id)
  paths.add(lesson.path)

  const relativePath = `${lesson.path.replace(/^\//, '')}.md`
  const absolutePath = join(docsRoot, relativePath)
  if (!existsSync(absolutePath)) {
    errors.push(`课程文件不存在：${relativePath}`)
    continue
  }

  const content = await readFile(absolutePath, 'utf8')
  if (!new RegExp(`<InvestmentChecklist[\\s\\S]*?id="${escapeRegExp(lesson.id)}"`).test(content)) {
    errors.push(`完成清单 ID 缺失或不匹配：${relativePath}（应为 ${lesson.id}）`)
  }
  if (!casePaths.has(relativePath)) {
    errors.push(`课程缺少案例：${relativePath}`)
  }
  if (!content.includes('<KnowledgeCheck') && lesson.id !== 'action-capstone') {
    errors.push(`课程缺少即时测验：${relativePath}`)
  }
  if (!content.includes('class="learning-objectives"')) {
    errors.push(`课程缺少学习目标：${relativePath}`)
  }
  if (!/^#\s+\S+/m.test(content)) errors.push(`课程缺少一级标题：${relativePath}`)
  if (!/建议用时/.test(content)) errors.push(`课程缺少建议用时：${relativePath}`)
  if (/<\!--\s*TODO/i.test(content)) errors.push(`课程正文包含 TODO：${relativePath}`)
}

for (const casePath of casePaths) {
  const route = `/${casePath.replace(/\.md$/, '')}`
  if (!paths.has(route)) errors.push(`案例没有对应课程：${casePath}`)
}

const markdownFiles = await collectFiles(docsRoot, '.md')
for (const absolutePath of markdownFiles) {
  if (absolutePath.includes('/.vitepress/dist/') || absolutePath.includes('/.vitepress/cache/')) continue
  const content = await readFile(absolutePath, 'utf8')
  const relativePath = absolutePath.slice(docsRoot.length + 1)

  if (/课程版本\s*V?\d|(?:^|[\s·])V[12](?:\s|·|$)/m.test(content)) {
    errors.push(`存在面向读者的课程版本标签：${relativePath}`)
  }

  for (const match of content.matchAll(/\]\((\/[^)\s#]+)(#[^)]+)?\)/g)) {
    const route = match[1]
    const target =
      route === '/'
        ? join(docsRoot, 'index.md')
        : join(docsRoot, route.replace(/^\//, ''))
    const candidates = [target, `${target}.md`, join(target, 'index.md')]
    if (!candidates.some(existsSync)) {
      errors.push(`内部链接目标不存在：${relativePath} → ${route}`)
    }
  }
}

const lessonCaseComponent = await readFile(
  join(docsRoot, '.vitepress', 'theme', 'components', 'LessonCase.vue'),
  'utf8'
)
if (!lessonCaseComponent.includes('id="applied-case"')) {
  errors.push('案例组件缺少稳定锚点 applied-case')
}

console.log('课程内容审计')
console.log(`- 核心课程：${lessons.length}`)
console.log(`- 案例数据：${casePaths.size}`)
console.log(`- Markdown 页面：${markdownFiles.length}`)

if (warnings.length) {
  console.log('\n提醒：')
  warnings.forEach((warning) => console.log(`  ! ${warning}`))
}

if (errors.length) {
  console.error('\n未通过：')
  errors.forEach((error) => console.error(`  ✗ ${error}`))
  process.exit(1)
}

console.log('\n✓ 所有课程文件、学习目标、完成清单、即时测验和案例一一对应')
console.log('✓ 所有案例均可使用统一锚点直达')
console.log('✓ 内部页面链接均有对应文件')
console.log('✓ 未发现面向读者的课程版本标签')

async function collectFiles(directory, extension) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) output.push(...(await collectFiles(path, extension)))
    else if (path.endsWith(extension)) output.push(path)
  }
  return output
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
