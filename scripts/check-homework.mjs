import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assignments = {
  '01': {
    file: '01-starting-point.md',
    sections: ['月度现金流', '资产负债表', '安全垫', '投资目标', '风险与约束', '未来 90 天行动', '当前不做什么']
  },
  '02': {
    file: '02-product-anatomy.md',
    sections: ['产品身份', '资料来源', '三层结构', '收益如何产生', '风险地图', '流动性与退出', '成本', '目标匹配', '结论']
  },
  '03': {
    file: '03-asset-comparison.md',
    sections: ['比较目的', '资产、载体与策略', '统一维度比较', '每类资产的一句话角色', '证据与来源', '结论']
  },
  '04': {
    file: '04-paper-portfolio.md',
    sections: ['目标与资金边界', '风险边界', '目标资产配置', '候选产品比较', '投入与再平衡规则', '压力测试', '下跌预演', '四周模拟日志', '模拟结论']
  },
  '05': {
    file: '05-investment-manual.md',
    sections: ['投资目的', '财务起点与安全底线', '目标与限制', '我的资产观', '投资政策声明', '坏情景预案', '记录与复盘', '家人应急摘要', '十题答辩', '外部反馈']
  },
  '06': {
    file: '06-global-allocation.md',
    sections: ['家庭地域暴露', '全球配置目标', '实施路径比较', '跨境风险登记', '全球组合设计', '穿透检查', '结论']
  },
  '07': {
    file: '07-company-research.md',
    sections: ['研究边界', '商业模式', '行业与竞争', '财务报表', '管理层与资本配置', '估值', '反方论证', '可证伪条件', '组合与仓位', '结论']
  },
  '08': {
    file: '08-family-financial-safety.md',
    sections: ['家庭风险地图', '保险与保障缺口', '住房与房贷', '家庭共同决策', '资产地图与应急接管', '退休目标', '未来一年行动']
  },
  '09': {
    file: '09-fixed-income-audit.md',
    sections: ['产品与角色', '债券定价', '久期与凸性', '信用风险', '杠杆与流动性', '收益归因', '压力测试', '结论']
  },
  '10': {
    file: '10-investment-claim-audit.md',
    sections: ['原始主张', '可检验命题', '经济机制', '数据与方法', '样本外与反证', '可执行性', '证据等级', '结论']
  },
  '11': {
    file: '11-annual-wealth-review.md',
    sections: ['家庭变化', '安全基础', '目标进度', '资产配置', '投资收益', '绩效归因', '产品与风险变化', '行为与流程', '下一年度最多三项行动', 'IPS 变更']
  }
}

const number = normalizeNumber(process.argv[2])
const assignment = assignments[number]

if (!assignment) {
  console.error('用法：npm run homework:check -- 01')
  console.error(`可用编号：${Object.keys(assignments).join(', ')}`)
  process.exit(1)
}

const path = join(root, 'homework', 'my-learning', assignment.file)
let content

try {
  content = await readFile(path, 'utf8')
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`没有找到：${path}`)
    console.error(`请先执行：npm run homework:new -- ${number}`)
    process.exit(1)
  }
  throw error
}

const failures = []
const warnings = []
const scores = []

for (const section of assignment.sections) {
  const headingPattern = new RegExp(`^#{2,3}\\s+.*${escapeRegExp(section)}.*$`, 'm')
  if (!headingPattern.test(content)) failures.push(`缺少必填小节：${section}`)
}

const todos = content.match(/<!--\s*TODO[\s\S]*?-->/g) ?? []
if (todos.length > 0) {
  failures.push(`仍有 ${todos.length} 个 TODO 待填写`)
}

const visibleText = content
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/[#>*|`\-[\]]/g, ' ')
  .replace(/\s+/g, '')

const minimumLengths = {
  '01': 900,
  '02': 1100,
  '03': 1100,
  '04': 1500,
  '05': 1800,
  '06': 1300,
  '07': 1800,
  '08': 1500,
  '09': 1400,
  '10': 1300,
  '11': 1600
}
const minimumLength = minimumLengths[number]
if (visibleText.length < minimumLength) {
  warnings.push(`正文约 ${visibleText.length} 字，建议达到 ${minimumLength} 字以上以充分说明理由`)
}

if (!/自评分数[：:]\s*(?!$)/m.test(content)) {
  warnings.push('没有检测到自评分数')
}

if (!/https?:\/\/|来源|文件位置/.test(content)) {
  warnings.push('没有检测到来源记录，请确认关键事实可核验')
}

const sectionScore = Math.round(
  (assignment.sections.filter((section) =>
    new RegExp(`^#{2,3}\\s+.*${escapeRegExp(section)}.*$`, 'm').test(content)
  ).length /
    assignment.sections.length) *
    25
)
const depthScore = Math.max(
  0,
  Math.round(Math.min(1, visibleText.length / minimumLength) * 25 - Math.min(12, todos.length * 1.5))
)
const sourceSignals = countMatches(content, /https?:\/\/|来源|招募说明书|年报|季报|合同|公告/g)
const dateSignals = countMatches(content, /20\d{2}[-/.年]\d{1,2}|数据截止|信息截止/g)
const evidenceScore = Math.min(15, sourceSignals * 2 + dateSignals * 2)
const numberSignals = countMatches(content, /\d+(?:\.\d+)?\s*(?:%|元|万|年|月|倍|天)/g)
const tableRows = countMatches(content, /^\|.*\|$/gm)
const quantScore = Math.min(15, Math.round(numberSignals * 0.7 + tableRows * 0.35))
const reasoningSignals = countMatches(
  content,
  /因为|所以|如果|则|目标|期限|不做|禁止|重新评估|修订|预案|风险|亏损|回撤|最坏|失败|不确定|流动性|集中/g
)
const reasoningScore = Math.min(20, Math.round(reasoningSignals * 0.65))
const consistencyNotes = checkConsistency(content)
scores.push(
  ['必填结构', sectionScore, 25],
  ['完成深度', depthScore, 25],
  ['证据与时效', evidenceScore, 15],
  ['量化与可核验', quantScore, 15],
  ['推理与风险意识', reasoningScore, 20]
)
const totalScore = scores.reduce((sum, [, score]) => sum + score, 0)

console.log(`\n作业 ${number} 结构自检`)
console.log(`文件：${path}\n`)

if (failures.length > 0) {
  console.log('未通过：')
  failures.forEach((failure) => console.log(`  ✗ ${failure}`))
} else {
  console.log('✓ 必填小节齐全')
  console.log('✓ 没有遗留 TODO 标记')
}

if (warnings.length > 0) {
  console.log('\n建议人工复核：')
  warnings.forEach((warning) => console.log(`  ! ${warning}`))
}

if (consistencyNotes.length > 0) {
  console.log('\n数字一致性检查：')
  consistencyNotes.forEach((note) => console.log(`  ! ${note}`))
}

console.log('\n自动评分（仅结构与完成度）：')
scores.forEach(([name, score, max]) => {
  console.log(`  ${String(name).padEnd(14, '　')} ${String(score).padStart(2)} / ${max}`)
})
console.log(`  总分　　　　　　　　 ${String(totalScore).padStart(2)} / 100`)
console.log(
  totalScore >= 80 && failures.length === 0
    ? '  结论：可以进入人工量规复核'
    : '  结论：建议补充后再复核'
)

console.log('\n注意：脚本只检查结构，不判断投资结论是否正确。请回到作业中心按量规人工评分。')
process.exitCode = failures.length > 0 ? 1 : 0

function normalizeNumber(value = '') {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? String(parsed).padStart(2, '0') : value
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0
}

function checkConsistency(value) {
  const notes = []
  const tables = value.split(/\n\s*\n/)
  for (const table of tables) {
    const lines = table.split('\n').filter((line) => line.trim().startsWith('|'))
    if (lines.length < 4 || !lines[0].includes('目标比例')) continue
    const header = lines[0].split('|').map((cell) => cell.trim()).filter(Boolean)
    const targetIndex = header.findIndex((cell) => cell.includes('目标比例'))
    if (targetIndex < 0) continue
    const percentages = []
    for (const line of lines.slice(2)) {
      if (line.includes('合计') || line.includes('TODO')) continue
      const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean)
      const match = cells[targetIndex]?.match(/(-?\d+(?:\.\d+)?)\s*%/)
      if (match) percentages.push(Number(match[1]))
    }
    if (percentages.length >= 2) {
      const sum = percentages.reduce((total, item) => total + item, 0)
      if (Math.abs(sum - 100) > 0.01) notes.push(`目标配置比例合计为 ${sum.toFixed(1)}%，应核验是否为 100%`)
      else notes.push('目标配置比例合计为 100%')
    }
  }
  if (notes.length === 0) notes.push('未发现可自动核对的完整目标比例表；请人工检查加总和公式口径')
  return notes
}
