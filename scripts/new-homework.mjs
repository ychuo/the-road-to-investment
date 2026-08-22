import { copyFile, mkdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assignments = {
  '01': '01-starting-point.md',
  '02': '02-product-anatomy.md',
  '03': '03-asset-comparison.md',
  '04': '04-paper-portfolio.md',
  '05': '05-investment-manual.md',
  '06': '06-global-allocation.md',
  '07': '07-company-research.md',
  '08': '08-family-financial-safety.md',
  '09': '09-fixed-income-audit.md',
  '10': '10-investment-claim-audit.md',
  '11': '11-annual-wealth-review.md'
}

const number = normalizeNumber(process.argv[2])
const filename = assignments[number]

if (!filename) {
  console.error('用法：npm run homework:new -- 01')
  console.error(`可用编号：${Object.keys(assignments).join(', ')}`)
  process.exit(1)
}

const source = join(root, 'homework', 'templates', filename)
const destination = join(root, 'homework', 'my-learning', filename)

await mkdir(dirname(destination), { recursive: true })

try {
  await stat(destination)
  console.error(`未覆盖已有文件：${destination}`)
  console.error('如需重新开始，请先手动重命名或删除该文件。')
  process.exit(1)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

await copyFile(source, destination)
console.log(`已创建：${destination}`)
console.log(`完成后执行：npm run homework:check -- ${number}`)

function normalizeNumber(value = '') {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? String(parsed).padStart(2, '0') : value
}
