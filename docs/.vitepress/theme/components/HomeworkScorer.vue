<script setup lang="ts">
import { computed, ref } from 'vue'

type Assignment = {
  id: string
  title: string
  requiredSections: string[]
  concepts: string[]
  minimumLength: number
}

type ScoreItem = {
  name: string
  score: number
  max: number
  detail: string
}

const assignments: Assignment[] = [
  assignment('01', '个人投资起点报告', ['月度现金流', '资产负债表', '安全垫', '投资目标', '风险与约束', '未来 90 天行动', '当前不做什么'], ['结余率', '净资产', '应急金', '期限', '优先级'], 900),
  assignment('02', '产品风险解剖卡', ['产品身份', '资料来源', '三层结构', '收益如何产生', '风险地图', '流动性与退出', '成本', '目标匹配', '结论'], ['底层资产', '收益来源', '费用', '流动性', '风险'], 1100),
  assignment('03', '四类资产比较报告', ['比较目的', '资产、载体与策略', '统一维度比较', '每类资产的一句话角色', '证据与来源', '结论'], ['现金', '债券', '股票', '收益来源', '不能提供'], 1100),
  assignment('04', '纸面模拟组合', ['目标与资金边界', '风险边界', '目标资产配置', '候选产品比较', '投入与再平衡规则', '压力测试', '下跌预演', '四周模拟日志', '模拟结论'], ['目标比例', '再平衡', '市场冲击', '个人冲击', '执行冲击'], 1500),
  assignment('05', '个人投资操作手册', ['投资目的', '财务起点与安全底线', '目标与限制', '我的资产观', '投资政策声明', '坏情景预案', '记录与复盘', '家人应急摘要', '十题答辩', '外部反馈'], ['目标配置', '投入规则', '再平衡规则', '禁止事项', '复盘'], 1800),
  assignment('06', '全球配置附录', ['家庭地域暴露', '全球配置目标', '实施路径比较', '跨境风险登记', '全球组合设计', '穿透检查', '结论'], ['港股', '美股', '汇率', '税务', '托管'], 1300),
  assignment('07', '企业研究备忘录', ['商业模式', '行业与竞争', '财务报表', '管理层与资本配置', '估值', '反方论证', '可证伪条件', '组合与仓位', '结论'], ['现金流', '竞争优势', '资本回报', '估值', '安全边际'], 1800),
  assignment('08', '家庭财务安全计划', ['家庭风险地图', '保险与保障缺口', '住房与房贷', '家庭共同决策', '资产地图与应急接管', '退休目标', '未来一年行动'], ['保险', '应急', '房贷', '家庭', '退休'], 1500),
  assignment('09', '固收风险审计', ['产品与角色', '债券定价', '久期与凸性', '信用风险', '杠杆与流动性', '收益归因', '压力测试', '结论'], ['到期收益率', '久期', '信用', '杠杆', '流动性'], 1400),
  assignment('10', '投资主张审计', ['原始主张', '可检验命题', '经济机制', '数据与方法', '样本外与反证', '可执行性', '证据等级', '结论'], ['基准', '过拟合', '费用', '反证', '利益关系'], 1300),
  assignment('11', '年度财富体检报告', ['家庭变化', '安全基础', '目标进度', '资产配置', '投资收益', '绩效归因', '产品与风险变化', '行为与流程', '下一年度最多三项行动', 'IPS 变更'], ['时间加权', '资金加权', '配置', '费用', '复盘'], 1600)
]

const selectedId = ref('01')
const content = ref('')
const filename = ref('')
const hasScored = ref(false)
const result = ref<ScoreItem[]>([])
const selectedAssignment = computed(
  () => assignments.find((item) => item.id === selectedId.value) ?? assignments[0]
)
const total = computed(() => result.value.reduce((sum, item) => sum + item.score, 0))
const grade = computed(() => {
  if (total.value >= 90) return { label: '结构优秀', className: 'is-excellent' }
  if (total.value >= 80) return { label: '可以进入人工复核', className: 'is-ready' }
  if (total.value >= 60) return { label: '建议补充后再复核', className: 'is-revise' }
  return { label: '尚未达到完整草稿', className: 'is-incomplete' }
})

async function loadFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  filename.value = file.name
  content.value = await file.text()
  hasScored.value = false
}

function scoreHomework() {
  const assignment = selectedAssignment.value
  const raw = content.value
  const visible = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/[#>*|`\-[\]]/g, ' ')
    .replace(/\s+/g, '')
  const todoCount = (raw.match(/<!--\s*TODO[\s\S]*?-->/g) ?? []).length
  const foundSections = assignment.requiredSections.filter((section) =>
    new RegExp(`^#{2,3}\\s+.*${escapeRegExp(section)}.*$`, 'm').test(raw)
  )
  const conceptCount = assignment.concepts.filter((concept) => raw.includes(concept)).length
  const sourceSignals = countMatches(raw, /https?:\/\/|来源|招募说明书|年报|季报|合同|公告/g)
  const dateSignals = countMatches(raw, /20\d{2}[-/.年]\d{1,2}|数据截止|信息截止/g)
  const numberSignals = countMatches(raw, /\d+(?:\.\d+)?\s*(?:%|元|万|年|月|倍|天)/g)
  const tableRows = countMatches(raw, /^\|.*\|$/gm)
  const decisionSignals = countMatches(raw, /因为|所以|如果|则|目标|期限|不做|禁止|重新评估|修订|预案/g)
  const riskSignals = countMatches(raw, /风险|亏损|回撤|最坏|失败|不确定|流动性|债务|集中/g)

  const structureScore = Math.round((foundSections.length / assignment.requiredSections.length) * 25)
  const depthRatio = Math.min(1, visible.length / assignment.minimumLength)
  const completionPenalty = Math.min(12, todoCount * 1.5)
  const depthScore = Math.max(0, Math.round(depthRatio * 25 - completionPenalty))
  const evidenceScore = Math.min(15, sourceSignals * 2 + dateSignals * 2)
  const quantScore = Math.min(15, Math.round(numberSignals * 0.7 + tableRows * 0.35))
  const reasoningScore = Math.min(
    20,
    Math.round(decisionSignals * 0.7 + riskSignals * 0.5 + conceptCount * 1.5)
  )

  result.value = [
    {
      name: '必填结构',
      score: structureScore,
      max: 25,
      detail:
        foundSections.length === assignment.requiredSections.length
          ? '必填小节齐全'
          : `缺少：${assignment.requiredSections.filter((item) => !foundSections.includes(item)).join('、')}`
    },
    {
      name: '完成深度',
      score: depthScore,
      max: 25,
      detail: `有效正文约 ${visible.length} 字；遗留 ${todoCount} 个 TODO`
    },
    {
      name: '证据与时效',
      score: evidenceScore,
      max: 15,
      detail: `检测到 ${sourceSignals} 个来源线索、${dateSignals} 个日期线索`
    },
    {
      name: '量化与可核验',
      score: quantScore,
      max: 15,
      detail: `检测到 ${numberSignals} 个量化表达、${tableRows} 行表格`
    },
    {
      name: '推理与风险意识',
      score: reasoningScore,
      max: 20,
      detail: `覆盖 ${conceptCount}/${assignment.concepts.length} 个关键概念，并检测理由、预案与风险表达`
    }
  ]

  hasScored.value = true
  window.localStorage.setItem(
    `investment-road:homework-score:${selectedId.value}`,
    JSON.stringify({
      score: total.value,
      title: assignment.title,
      scoredAt: new Date().toISOString(),
      structuralOnly: true
    })
  )
  window.dispatchEvent(new CustomEvent('investment-progress-updated'))
}

function clear() {
  content.value = ''
  filename.value = ''
  result.value = []
  hasScored.value = false
  window.localStorage.removeItem(`investment-road:homework-score:${selectedId.value}`)
  window.dispatchEvent(new CustomEvent('investment-progress-updated'))
}

function countMatches(value: string, pattern: RegExp) {
  return value.match(pattern)?.length ?? 0
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function checkConsistency(value: string) {
  const notes: string[] = []
  const tables = value.split(/\n\s*\n/)
  for (const table of tables) {
    const lines = table.split('\n').filter((line) => line.trim().startsWith('|'))
    if (lines.length < 4 || !lines[0].includes('目标比例')) continue
    const header = lines[0].split('|').map((cell) => cell.trim()).filter(Boolean)
    const targetIndex = header.findIndex((cell) => cell.includes('目标比例'))
    if (targetIndex < 0) continue
    const percentages: number[] = []
    for (const line of lines.slice(2)) {
      if (line.includes('合计') || line.includes('TODO')) continue
      const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean)
      const match = cells[targetIndex]?.match(/(-?\d+(?:\.\d+)?)\s*%/)
      if (match) percentages.push(Number(match[1]))
    }
    if (percentages.length >= 2) {
      const sum = percentages.reduce((total, item) => total + item, 0)
      notes.push(
        Math.abs(sum - 100) <= 0.01
          ? '目标配置比例合计为 100%。'
          : `目标配置比例合计为 ${sum.toFixed(1)}%，请核验是否应为 100%。`
      )
    }
  }
  if (notes.length === 0) {
    notes.push('未发现可自动核对的完整目标比例表；请人工检查表格加总、公式和数据口径。')
  }
  return notes
}

function assignment(
  id: string,
  title: string,
  requiredSections: string[],
  concepts: string[],
  minimumLength: number
): Assignment {
  return { id, title, requiredSections, concepts, minimumLength }
}
</script>

<template>
  <div class="homework-scorer">
    <section class="scorer-input">
      <div class="scorer-title">
        <div>
          <span class="eyebrow">LOCAL STRUCTURE REVIEW</span>
          <h2>作业自动评分</h2>
        </div>
        <span class="privacy-badge">仅在本地处理</span>
      </div>

      <label class="form-label" for="assignment">选择作业</label>
      <select id="assignment" v-model="selectedId" @change="hasScored = false">
        <option v-for="item in assignments" :key="item.id" :value="item.id">
          {{ item.id }} · {{ item.title }}
        </option>
      </select>

      <div class="file-row">
        <label class="file-button">
          读取 Markdown 文件
          <input type="file" accept=".md,text/markdown,text/plain" @change="loadFile" />
        </label>
        <span>{{ filename || '文件不会上传' }}</span>
      </div>

      <label class="form-label" for="homework-content">或粘贴作业内容</label>
      <textarea
        id="homework-content"
        v-model="content"
        rows="14"
        placeholder="把已经填写的 Markdown 作业粘贴到这里……"
        @input="hasScored = false"
      ></textarea>

      <div class="scorer-actions">
        <button class="course-button" type="button" :disabled="content.trim().length < 20" @click="scoreHomework">
          开始评分
        </button>
        <button class="text-button" type="button" @click="clear">清空内容与本次记录</button>
      </div>
    </section>

    <section v-if="hasScored" class="score-result" :class="grade.className" aria-live="polite">
      <div class="score-result__summary">
        <div class="score-number">
          <strong>{{ total }}</strong>
          <span>/100</span>
        </div>
        <div>
          <span class="eyebrow">STRUCTURAL READINESS</span>
          <h3>{{ grade.label }}</h3>
          <p>{{ selectedAssignment.title }}</p>
        </div>
      </div>

      <div class="score-breakdown">
        <article v-for="item in result" :key="item.name">
          <div>
            <strong>{{ item.name }}</strong>
            <span>{{ item.score }} / {{ item.max }}</span>
          </div>
          <div class="score-track">
            <span :style="{ width: `${(item.score / item.max) * 100}%` }"></span>
          </div>
          <p>{{ item.detail }}</p>
        </article>
      </div>

      <div class="score-warning">
        <strong>这不是投资建议或正确性判定。</strong>
        自动评分只能检查结构、证据线索、量化程度和风险表达。达到 80 分后，仍需按照人工量规检查事实、推理与个人适配性。
      </div>
      <div class="consistency-review">
        <strong>数字一致性提示</strong>
        <ul>
          <li v-for="note in checkConsistency(content)" :key="note">{{ note }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>
