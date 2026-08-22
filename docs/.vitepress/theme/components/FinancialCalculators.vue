<script setup lang="ts">
import { computed, ref } from 'vue'

const active = ref<'compound' | 'emergency' | 'drawdown' | 'retirement' | 'housing'>('compound')

const principal = ref(100000)
const monthlyContribution = ref(3000)
const annualReturn = ref(6)
const annualFee = ref(0.3)
const inflation = ref(2)
const years = ref(20)

const necessaryExpense = ref(7000)
const emergencyMonths = ref(6)
const availableEmergency = ref(20000)

const portfolioValue = ref(300000)
const drawdown = ref(30)

const retirementAnnualExpense = ref(180000)
const retirementReliableIncome = ref(80000)
const withdrawalRate = ref(3.5)
const retirementAssets = ref(500000)

const housePrice = ref(2400000)
const downPayment = ref(720000)
const mortgageRate = ref(3.5)
const mortgageYears = ref(30)
const annualRent = ref(60000)
const annualOwnershipCost = ref(24000)
const opportunityReturn = ref(3)

const nominalFutureValue = computed(() => {
  const monthlyRate = Math.max(-0.99, (annualReturn.value - annualFee.value) / 100 / 12)
  const periods = Math.max(0, years.value * 12)
  const lumpSum = principal.value * (1 + monthlyRate) ** periods
  const contributions =
    monthlyRate === 0
      ? monthlyContribution.value * periods
      : monthlyContribution.value * (((1 + monthlyRate) ** periods - 1) / monthlyRate)
  return lumpSum + contributions
})
const realFutureValue = computed(
  () => nominalFutureValue.value / (1 + inflation.value / 100) ** years.value
)
const totalContributed = computed(
  () => principal.value + monthlyContribution.value * years.value * 12
)

const emergencyTarget = computed(() => necessaryExpense.value * emergencyMonths.value)
const emergencyGap = computed(() => Math.max(0, emergencyTarget.value - availableEmergency.value))
const currentCoverage = computed(() =>
  necessaryExpense.value > 0 ? availableEmergency.value / necessaryExpense.value : 0
)

const lossAmount = computed(() => portfolioValue.value * (drawdown.value / 100))
const valueAfterLoss = computed(() => portfolioValue.value - lossAmount.value)
const recoveryGain = computed(() =>
  drawdown.value >= 100 ? Number.POSITIVE_INFINITY : drawdown.value / (100 - drawdown.value) * 100
)

const retirementGap = computed(() =>
  Math.max(0, retirementAnnualExpense.value - retirementReliableIncome.value)
)
const retirementTarget = computed(() =>
  withdrawalRate.value > 0 ? retirementGap.value / (withdrawalRate.value / 100) : 0
)
const retirementFundingRatio = computed(() =>
  retirementTarget.value > 0 ? retirementAssets.value / retirementTarget.value : 1
)

const loanAmount = computed(() => Math.max(0, housePrice.value - downPayment.value))
const monthlyMortgage = computed(() => {
  const rate = mortgageRate.value / 100 / 12
  const periods = mortgageYears.value * 12
  if (periods <= 0) return 0
  if (rate === 0) return loanAmount.value / periods
  return loanAmount.value * (rate * (1 + rate) ** periods) / ((1 + rate) ** periods - 1)
})
const firstYearInterest = computed(() => loanAmount.value * (mortgageRate.value / 100))
const downPaymentOpportunity = computed(() => downPayment.value * (opportunityReturn.value / 100))
const annualUnrecoverable = computed(
  () => firstYearInterest.value + annualOwnershipCost.value + downPaymentOpportunity.value
)

function money(value: number) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0)
}

function percent(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`
}
</script>

<template>
  <div class="financial-calculators">
    <div class="calculator-tabs" role="tablist" aria-label="计算器类型">
      <button :class="{ active: active === 'compound' }" @click="active = 'compound'">复利与费用</button>
      <button :class="{ active: active === 'emergency' }" @click="active = 'emergency'">应急金</button>
      <button :class="{ active: active === 'drawdown' }" @click="active = 'drawdown'">回撤与回本</button>
      <button :class="{ active: active === 'retirement' }" @click="active = 'retirement'">退休缺口</button>
      <button :class="{ active: active === 'housing' }" @click="active = 'housing'">住房成本</button>
    </div>

    <section v-if="active === 'compound'" class="calculator-panel">
      <div class="calculator-fields">
        <label>初始本金（元）<input v-model.number="principal" type="number" min="0" step="1000" /></label>
        <label>每月投入（元）<input v-model.number="monthlyContribution" type="number" min="0" step="100" /></label>
        <label>假设年化毛回报（%）<input v-model.number="annualReturn" type="number" step="0.1" /></label>
        <label>年度总费用（%）<input v-model.number="annualFee" type="number" min="0" step="0.1" /></label>
        <label>通胀假设（%）<input v-model.number="inflation" type="number" min="0" step="0.1" /></label>
        <label>投资年数<input v-model.number="years" type="number" min="1" max="80" /></label>
      </div>
      <div class="calculator-results">
        <div><span>累计投入</span><strong>{{ money(totalContributed) }}</strong></div>
        <div><span>预计名义终值</span><strong>{{ money(nominalFutureValue) }}</strong></div>
        <div><span>按今天购买力</span><strong>{{ money(realFutureValue) }}</strong></div>
      </div>
      <p class="calculator-note">假设每月期末投入、回报平滑且税前。真实市场回报会波动，结果仅用于情景比较。</p>
    </section>

    <section v-else-if="active === 'emergency'" class="calculator-panel">
      <div class="calculator-fields">
        <label>每月必要支出（元）<input v-model.number="necessaryExpense" type="number" min="0" step="100" /></label>
        <label>目标覆盖月数<input v-model.number="emergencyMonths" type="number" min="1" max="24" /></label>
        <label>现有可用应急金（元）<input v-model.number="availableEmergency" type="number" min="0" step="1000" /></label>
      </div>
      <div class="calculator-results">
        <div><span>目标金额</span><strong>{{ money(emergencyTarget) }}</strong></div>
        <div><span>当前覆盖</span><strong>{{ currentCoverage.toFixed(1) }} 个月</strong></div>
        <div><span>仍需补足</span><strong>{{ money(emergencyGap) }}</strong></div>
      </div>
      <p class="calculator-note">覆盖月份应结合收入稳定性、家庭责任和保障情况决定，不是统一标准答案。</p>
    </section>

    <section v-else-if="active === 'drawdown'" class="calculator-panel">
      <div class="calculator-fields">
        <label>组合当前金额（元）<input v-model.number="portfolioValue" type="number" min="0" step="1000" /></label>
        <label>假设回撤（%）<input v-model.number="drawdown" type="number" min="0" max="100" step="1" /></label>
      </div>
      <div class="calculator-results">
        <div><span>损失金额</span><strong>{{ money(lossAmount) }}</strong></div>
        <div><span>回撤后余额</span><strong>{{ money(valueAfterLoss) }}</strong></div>
        <div><span>回到原点需上涨</span><strong>{{ recoveryGain === Infinity ? '无法回本' : percent(recoveryGain) }}</strong></div>
      </div>
      <p class="calculator-note">请把金额而非抽象百分比写入压力测试，并确认它不会破坏应急金和刚性目标。</p>
    </section>

    <section v-else-if="active === 'retirement'" class="calculator-panel">
      <div class="calculator-fields">
        <label>退休年支出（今日元）<input v-model.number="retirementAnnualExpense" type="number" min="0" step="1000" /></label>
        <label>可靠年收入（今日元）<input v-model.number="retirementReliableIncome" type="number" min="0" step="1000" /></label>
        <label>情景初始提取率（%）<input v-model.number="withdrawalRate" type="number" min="0.1" max="10" step="0.1" /></label>
        <label>当前退休资产（元）<input v-model.number="retirementAssets" type="number" min="0" step="10000" /></label>
      </div>
      <div class="calculator-results">
        <div><span>退休首年缺口</span><strong>{{ money(retirementGap) }}</strong></div>
        <div><span>静态目标估算</span><strong>{{ money(retirementTarget) }}</strong></div>
        <div><span>当前资金覆盖率</span><strong>{{ percent(retirementFundingRatio * 100) }}</strong></div>
      </div>
      <p class="calculator-note">这是“缺口 ÷ 提取率”的静态估算，不含未来投入、税务、顺序风险和寿命模拟，不能作为退休保证。</p>
    </section>

    <section v-else class="calculator-panel">
      <div class="calculator-fields">
        <label>房屋总价（元）<input v-model.number="housePrice" type="number" min="0" step="10000" /></label>
        <label>首付（元）<input v-model.number="downPayment" type="number" min="0" step="10000" /></label>
        <label>贷款年利率（%）<input v-model.number="mortgageRate" type="number" min="0" step="0.1" /></label>
        <label>贷款年数<input v-model.number="mortgageYears" type="number" min="1" max="40" /></label>
        <label>同类住房年租金（元）<input v-model.number="annualRent" type="number" min="0" step="1000" /></label>
        <label>年度税费维护（元）<input v-model.number="annualOwnershipCost" type="number" min="0" step="1000" /></label>
        <label>首付机会回报（%）<input v-model.number="opportunityReturn" type="number" min="0" step="0.1" /></label>
      </div>
      <div class="calculator-results">
        <div><span>贷款金额</span><strong>{{ money(loanAmount) }}</strong></div>
        <div><span>估算等额本息月供</span><strong>{{ money(monthlyMortgage) }}</strong></div>
        <div><span>首年不可回收成本</span><strong>{{ money(annualUnrecoverable) }}</strong></div>
        <div><span>同类年租金</span><strong>{{ money(annualRent) }}</strong></div>
      </div>
      <p class="calculator-note">不可回收成本仅含首年利息、输入的持有成本与首付机会成本，未含交易、装修、房价变化和贷款税费，仅用于建立比较框架。</p>
    </section>
  </div>
</template>

