import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '投资之路',
  description: '从零建立可执行、可复盘的个人投资系统',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#12372a' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '投资之路',
    nav: [
      { text: '开始学习', link: '/start/' },
      { text: '学习仪表盘', link: '/dashboard' },
      {
        text: '课程',
        items: [
          { text: '第一阶段 · 站稳起点', link: '/foundation/money-map' },
          { text: '第二阶段 · 理解规律', link: '/principles/return-risk' },
          { text: '第三阶段 · 认识资产', link: '/assets/cash-bonds' },
          { text: '第四阶段 · 构建组合', link: '/portfolio/allocation' },
          { text: '第五阶段 · 开始行动', link: '/action/ips' },
          { text: '第六阶段 · 走向全球', link: '/global/why-global' },
          { text: '第七阶段 · 企业分析', link: '/advanced/statements' },
          { text: '第八阶段 · 家庭财务', link: '/life/insurance' },
          { text: '第九阶段 · 固收进阶', link: '/fixed-income/pricing' },
          { text: '第十阶段 · 历史与证据', link: '/evidence/macro-cycles' },
          { text: '第十一阶段 · 组合运营', link: '/operations/returns' }
        ]
      },
      { text: '作业中心', link: '/homework/' },
      { text: '工具箱', link: '/reference/glossary' },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/start/': [
        {
          text: '开始之前',
          items: [
            { text: '学习指南', link: '/start/' },
            { text: '课程地图', link: '/start/roadmap' },
            { text: '每天 2 小时学习计划', link: '/start/study-plan' },
            { text: '投资安全边界', link: '/start/safety' }
          ]
        }
      ],
      '/foundation/': courseSidebar(),
      '/principles/': courseSidebar(),
      '/assets/': courseSidebar(),
      '/portfolio/': courseSidebar(),
      '/action/': courseSidebar(),
      '/global/': courseSidebar(),
      '/advanced/': courseSidebar(),
      '/life/': courseSidebar(),
      '/fixed-income/': courseSidebar(),
      '/evidence/': courseSidebar(),
      '/operations/': courseSidebar(),
      '/cases/': referenceSidebar(),
      '/homework/': [
        {
          text: '作业与验收',
          items: [
            { text: '作业中心', link: '/homework/' },
            { text: '本地自动评分', link: '/homework/auto-score' },
            { text: '如何提交与复盘', link: '/homework/how-to-submit' }
          ]
        }
      ],
      '/reference/': referenceSidebar()
    },
    outline: {
      level: [2, 3],
      label: '本页内容'
    },
    docFooter: {
      prev: '上一课',
      next: '下一课'
    },
    lastUpdated: {
      text: '最后更新'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '课程目录',
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索课程',
            buttonAriaLabel: '搜索课程'
          },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  },
  markdown: {
    lineNumbers: true,
    math: true
  }
})

function courseSidebar() {
  return [
    {
      text: '第 1 阶段 · 站稳起点',
      collapsed: false,
      items: [
        { text: '1.1 画出你的金钱地图', link: '/foundation/money-map' },
        { text: '1.2 建立财务安全垫', link: '/foundation/safety-net' },
        { text: '1.3 写下目标与期限', link: '/foundation/goals' }
      ]
    },
    {
      text: '第 2 阶段 · 理解规律',
      collapsed: false,
      items: [
        { text: '2.1 收益、风险与不确定性', link: '/principles/return-risk' },
        { text: '2.2 复利、通胀与费用', link: '/principles/compounding' },
        { text: '2.3 市场如何给资产定价', link: '/principles/market' },
        { text: '2.4 识别自己的行为偏差', link: '/principles/behavior' }
      ]
    },
    {
      text: '第 3 阶段 · 认识资产',
      collapsed: false,
      items: [
        { text: '3.1 现金与债券', link: '/assets/cash-bonds' },
        { text: '3.2 股票：买的是企业', link: '/assets/stocks' },
        { text: '3.3 基金与指数基金', link: '/assets/funds' },
        { text: '3.4 黄金、REITs 与其他资产', link: '/assets/alternatives' }
      ]
    },
    {
      text: '第 4 阶段 · 构建组合',
      collapsed: false,
      items: [
        { text: '4.1 资产配置', link: '/portfolio/allocation' },
        { text: '4.2 分散、相关性与再平衡', link: '/portfolio/diversification' },
        { text: '4.3 读懂并筛选基金', link: '/portfolio/fund-selection' },
        { text: '4.4 压力测试你的组合', link: '/portfolio/stress-test' }
      ]
    },
    {
      text: '第 5 阶段 · 开始行动',
      collapsed: false,
      items: [
        { text: '5.1 写投资政策声明', link: '/action/ips' },
        { text: '5.2 制定投入与交易规则', link: '/action/execution' },
        { text: '5.3 记录、复盘与迭代', link: '/action/review' },
        { text: '5.4 毕业项目', link: '/action/capstone' }
      ]
    },
    {
      text: '第 6 阶段 · 走向全球',
      collapsed: false,
      items: [
        { text: '6.1 为什么进行全球配置', link: '/global/why-global' },
        { text: '6.2 港股与美股市场', link: '/global/markets' },
        { text: '6.3 汇率、税务与账户风险', link: '/global/currency-tax' },
        { text: '6.4 构建全球组合', link: '/global/global-portfolio' }
      ]
    },
    {
      text: '第 7 阶段 · 企业分析',
      collapsed: false,
      items: [
        { text: '7.1 读懂三张财务报表', link: '/advanced/statements' },
        { text: '7.2 分析商业模式与质量', link: '/advanced/business-quality' },
        { text: '7.3 估值是一组假设', link: '/advanced/valuation' },
        { text: '7.4 建立研究流程', link: '/advanced/research-process' }
      ]
    },
    {
      text: '第 8 阶段 · 家庭财务',
      collapsed: false,
      items: [
        { text: '8.1 风险保障与保险', link: '/life/insurance' },
        { text: '8.2 住房、房贷与租购', link: '/life/housing' },
        { text: '8.3 家庭共同决策与传承', link: '/life/family-governance' },
        { text: '8.4 退休目标与养老金', link: '/life/retirement' }
      ]
    },
    {
      text: '第 9 阶段 · 固收进阶',
      collapsed: false,
      items: [
        { text: '9.1 债券定价与收益率曲线', link: '/fixed-income/pricing' },
        { text: '9.2 久期、凸性与利率风险', link: '/fixed-income/duration' },
        { text: '9.3 信用利差与违约', link: '/fixed-income/credit' },
        { text: '9.4 分析债券基金组合', link: '/fixed-income/fund-analysis' }
      ]
    },
    {
      text: '第 10 阶段 · 历史与证据',
      collapsed: false,
      items: [
        { text: '10.1 通胀、利率与经济周期', link: '/evidence/macro-cycles' },
        { text: '10.2 泡沫、危机与长期停滞', link: '/evidence/crises' },
        { text: '10.3 读懂投资数据与回测', link: '/evidence/backtests' },
        { text: '10.4 评估一项投资主张', link: '/evidence/claims' }
      ]
    },
    {
      text: '第 11 阶段 · 组合运营',
      collapsed: false,
      items: [
        { text: '11.1 正确测量投资收益', link: '/operations/returns' },
        { text: '11.2 组合绩效归因', link: '/operations/attribution' },
        { text: '11.3 退休提取与顺序风险', link: '/operations/decumulation' },
        { text: '11.4 年度财富体检', link: '/operations/annual-review' }
      ]
    }
  ]
}

function referenceSidebar() {
  return [
    {
      text: '学习工具箱',
      items: [
        { text: '投资术语表', link: '/reference/glossary' },
        { text: '计算公式速查', link: '/reference/formulas' },
        { text: '个人财务计算器', link: '/reference/calculators' },
        { text: '案例实验室', link: '/cases/' },
        { text: '信息源与核验', link: '/reference/sources' },
        { text: '推荐阅读', link: '/reference/reading' }
      ]
    }
  ]
}
