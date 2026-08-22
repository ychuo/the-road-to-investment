import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import InvestmentChecklist from './components/InvestmentChecklist.vue'
import KnowledgeCheck from './components/KnowledgeCheck.vue'
import RiskSpectrum from './components/RiskSpectrum.vue'
import LearningDashboard from './components/LearningDashboard.vue'
import HomeworkScorer from './components/HomeworkScorer.vue'
import FinancialCalculators from './components/FinancialCalculators.vue'
import LessonCase from './components/LessonCase.vue'
import CaseLibrary from './components/CaseLibrary.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-after': () => h(LessonCase)
    }),
  enhanceApp({ app }) {
    app.component('InvestmentChecklist', InvestmentChecklist)
    app.component('KnowledgeCheck', KnowledgeCheck)
    app.component('RiskSpectrum', RiskSpectrum)
    app.component('LearningDashboard', LearningDashboard)
    app.component('HomeworkScorer', HomeworkScorer)
    app.component('FinancialCalculators', FinancialCalculators)
    app.component('CaseLibrary', CaseLibrary)
  }
} satisfies Theme
