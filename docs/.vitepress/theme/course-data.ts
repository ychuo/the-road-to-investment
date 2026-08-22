export type CourseLesson = {
  id: string
  stage: string
  title: string
  path: string
  minutes: number
}

export type CourseStage = {
  id: string
  number: string
  title: string
  subtitle: string
  color: string
  lessons: CourseLesson[]
}

export const courseStages: CourseStage[] = [
  {
    id: 'foundation',
    number: '01',
    title: '站稳起点',
    subtitle: '现金流、安全垫与目标',
    color: '#176b4d',
    lessons: [
      lesson('foundation-money-map', 'foundation', '画出你的金钱地图', '/foundation/money-map', 45),
      lesson('foundation-safety-net', 'foundation', '建立财务安全垫', '/foundation/safety-net', 35),
      lesson('foundation-goals', 'foundation', '写下目标与期限', '/foundation/goals', 40)
    ]
  },
  {
    id: 'principles',
    number: '02',
    title: '理解规律',
    subtitle: '风险、复利、市场与行为',
    color: '#a7782c',
    lessons: [
      lesson('principles-return-risk', 'principles', '收益、风险与不确定性', '/principles/return-risk', 50),
      lesson('principles-compounding', 'principles', '复利、通胀与费用', '/principles/compounding', 45),
      lesson('principles-market', 'principles', '市场如何给资产定价', '/principles/market', 45),
      lesson('principles-behavior', 'principles', '识别自己的行为偏差', '/principles/behavior', 50)
    ]
  },
  {
    id: 'assets',
    number: '03',
    title: '认识资产',
    subtitle: '现金、债券、股票与基金',
    color: '#44756c',
    lessons: [
      lesson('assets-cash-bonds', 'assets', '现金与债券', '/assets/cash-bonds', 55),
      lesson('assets-stocks', 'assets', '股票：买的是企业', '/assets/stocks', 55),
      lesson('assets-funds', 'assets', '基金与指数基金', '/assets/funds', 60),
      lesson('assets-alternatives', 'assets', '黄金、REITs 与其他资产', '/assets/alternatives', 45)
    ]
  },
  {
    id: 'portfolio',
    number: '04',
    title: '构建组合',
    subtitle: '配置、分散、筛选与压测',
    color: '#987044',
    lessons: [
      lesson('portfolio-allocation', 'portfolio', '资产配置', '/portfolio/allocation', 60),
      lesson('portfolio-diversification', 'portfolio', '分散、相关性与再平衡', '/portfolio/diversification', 55),
      lesson('portfolio-fund-selection', 'portfolio', '读懂并筛选基金', '/portfolio/fund-selection', 65),
      lesson('portfolio-stress-test', 'portfolio', '压力测试你的组合', '/portfolio/stress-test', 60)
    ]
  },
  {
    id: 'action',
    number: '05',
    title: '开始行动',
    subtitle: '规则、执行与复盘',
    color: '#305c87',
    lessons: [
      lesson('action-ips', 'action', '写投资政策声明', '/action/ips', 60),
      lesson('action-execution', 'action', '制定投入与交易规则', '/action/execution', 45),
      lesson('action-review', 'action', '记录、复盘与迭代', '/action/review', 45),
      lesson('action-capstone', 'action', '毕业项目', '/action/capstone', 120)
    ]
  },
  {
    id: 'global',
    number: '06',
    title: '走向全球',
    subtitle: '港股、美股与全球配置',
    color: '#6d5b94',
    lessons: [
      lesson('global-why-global', 'global', '为什么进行全球配置', '/global/why-global', 50),
      lesson('global-markets', 'global', '港股与美股市场', '/global/markets', 60),
      lesson('global-currency-tax', 'global', '汇率、税务与账户风险', '/global/currency-tax', 60),
      lesson('global-global-portfolio', 'global', '构建全球组合', '/global/global-portfolio', 65)
    ]
  },
  {
    id: 'advanced',
    number: '07',
    title: '企业分析',
    subtitle: '财报、质量、估值与研究',
    color: '#8b514c',
    lessons: [
      lesson('advanced-statements', 'advanced', '读懂三张财务报表', '/advanced/statements', 70),
      lesson('advanced-business-quality', 'advanced', '分析商业模式与质量', '/advanced/business-quality', 65),
      lesson('advanced-valuation', 'advanced', '估值是一组假设', '/advanced/valuation', 75),
      lesson('advanced-research-process', 'advanced', '建立研究流程', '/advanced/research-process', 60)
    ]
  },
  {
    id: 'life',
    number: '08',
    title: '家庭财务',
    subtitle: '保险、住房、家庭与退休', 
    color: '#3f6b91',
    lessons: [
      lesson('life-insurance', 'life', '风险保障与保险', '/life/insurance', 65),
      lesson('life-housing', 'life', '住房、房贷与租购', '/life/housing', 70),
      lesson('life-family-governance', 'life', '家庭共同决策与传承', '/life/family-governance', 55),
      lesson('life-retirement', 'life', '退休目标与养老金', '/life/retirement', 75)
    ]
  },
  {
    id: 'fixed-income',
    number: '09',
    title: '固收进阶',
    subtitle: '定价、久期、信用与基金',
    color: '#747a3f',
    lessons: [
      lesson('fixed-income-pricing', 'fixed-income', '债券定价与收益率曲线', '/fixed-income/pricing', 65),
      lesson('fixed-income-duration', 'fixed-income', '久期、凸性与利率风险', '/fixed-income/duration', 65),
      lesson('fixed-income-credit', 'fixed-income', '信用利差与违约', '/fixed-income/credit', 65),
      lesson('fixed-income-fund-analysis', 'fixed-income', '分析债券基金组合', '/fixed-income/fund-analysis', 60)
    ]
  },
  {
    id: 'evidence',
    number: '10',
    title: '历史与证据',
    subtitle: '周期、危机、回测与主张',
    color: '#8c5f3d',
    lessons: [
      lesson('evidence-macro-cycles', 'evidence', '通胀、利率与经济周期', '/evidence/macro-cycles', 65),
      lesson('evidence-crises', 'evidence', '泡沫、危机与长期停滞', '/evidence/crises', 70),
      lesson('evidence-backtests', 'evidence', '读懂投资数据与回测', '/evidence/backtests', 65),
      lesson('evidence-claims', 'evidence', '评估一项投资主张', '/evidence/claims', 55)
    ]
  },
  {
    id: 'operations',
    number: '11',
    title: '组合运营',
    subtitle: '收益、归因、提取与体检',
    color: '#6b4d72',
    lessons: [
      lesson('operations-returns', 'operations', '正确测量投资收益', '/operations/returns', 60),
      lesson('operations-attribution', 'operations', '组合绩效归因', '/operations/attribution', 60),
      lesson('operations-decumulation', 'operations', '退休提取与顺序风险', '/operations/decumulation', 65),
      lesson('operations-annual-review', 'operations', '年度财富体检', '/operations/annual-review', 55)
    ]
  }
]

export const allLessons = courseStages.flatMap((stage) => stage.lessons)

function lesson(id: string, stage: string, title: string, path: string, minutes: number): CourseLesson {
  return { id, stage, title, path, minutes }
}
