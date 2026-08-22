<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { allLessons, courseStages } from '../course-data'

type LessonProgress = Record<string, { complete?: boolean; completedAt?: string | null }>
type ReviewProgress = Record<string, { count?: number; lastReviewedAt?: string }>

const progress = ref<LessonProgress>({})
const reviews = ref<ReviewProgress>({})
const quizStats = ref({ answered: 0, correct: 0 })
const homeworkStats = ref({ ready: 0, total: 11 })
const now = ref(Date.now())
const reviewIntervals = [1, 7, 30, 90]

const completedLessons = computed(() =>
  allLessons.filter((lesson) => progress.value[lesson.id]?.complete).length
)
const totalLessons = allLessons.length
const overallPercent = computed(() =>
  Math.round((completedLessons.value / totalLessons) * 100)
)
const totalMinutes = allLessons.reduce((sum, lesson) => sum + lesson.minutes, 0)
const completedMinutes = computed(() =>
  allLessons
    .filter((lesson) => progress.value[lesson.id]?.complete)
    .reduce((sum, lesson) => sum + lesson.minutes, 0)
)
const currentLesson = computed(
  () => allLessons.find((lesson) => !progress.value[lesson.id]?.complete) ?? allLessons.at(-1)!
)
const dueReviews = computed(() =>
  allLessons.filter((lesson) => {
    const completedAt = progress.value[lesson.id]?.completedAt
    if (!completedAt) return false
    const review = reviews.value[lesson.id] ?? {}
    const count = review.count ?? 0
    if (count >= reviewIntervals.length) return false
    const anchor = review.lastReviewedAt ?? completedAt
    const dueAt = new Date(anchor).getTime() + reviewIntervals[count] * 86_400_000
    return dueAt <= now.value
  })
)

onMounted(() => {
  loadProgress()
  window.addEventListener('storage', loadProgress)
  window.addEventListener('investment-progress-updated', loadProgress)
})

onUnmounted(() => {
  window.removeEventListener('storage', loadProgress)
  window.removeEventListener('investment-progress-updated', loadProgress)
})

function loadProgress() {
  try {
    progress.value = JSON.parse(
      window.localStorage.getItem('investment-road:lesson-progress') ?? '{}'
    )
  } catch {
    progress.value = {}
  }
  try {
    reviews.value = JSON.parse(window.localStorage.getItem('investment-road:reviews') ?? '{}')
  } catch {
    reviews.value = {}
  }
  now.value = Date.now()

  let answered = 0
  let correct = 0
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith('investment-road:quiz:')) continue
    try {
      const result = JSON.parse(window.localStorage.getItem(key) ?? '{}')
      if (result.submitted) answered += 1
      if (result.correct) correct += 1
    } catch {
      // Ignore invalid legacy entries.
    }
  }
  quizStats.value = { answered, correct }

  let ready = 0
  for (let number = 1; number <= homeworkStats.value.total; number += 1) {
    const key = `investment-road:homework-score:${String(number).padStart(2, '0')}`
    try {
      const score = JSON.parse(window.localStorage.getItem(key) ?? '{}')
      if (score.score >= 80) ready += 1
    } catch {
      // Ignore invalid legacy entries.
    }
  }
  homeworkStats.value = { ...homeworkStats.value, ready }
}

function markReviewed(lessonId: string) {
  const current = reviews.value[lessonId] ?? {}
  reviews.value = {
    ...reviews.value,
    [lessonId]: {
      count: Math.min(reviewIntervals.length, (current.count ?? 0) + 1),
      lastReviewedAt: new Date().toISOString()
    }
  }
  window.localStorage.setItem('investment-road:reviews', JSON.stringify(reviews.value))
}

function stageCompleted(stageId: string) {
  const stage = courseStages.find((item) => item.id === stageId)
  return stage?.lessons.filter((lesson) => progress.value[lesson.id]?.complete).length ?? 0
}

function stagePercent(stageId: string) {
  const stage = courseStages.find((item) => item.id === stageId)
  if (!stage) return 0
  return Math.round((stageCompleted(stageId) / stage.lessons.length) * 100)
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `${hours} 小时 ${rest} 分`
}
</script>

<template>
  <div class="learning-dashboard">
    <section class="dashboard-hero">
      <div>
        <span class="eyebrow">YOUR LEARNING JOURNEY</span>
        <h2>{{ overallPercent === 100 ? '基础与进阶路线已完成' : '继续你的投资之路' }}</h2>
        <p>
          已完成 {{ completedLessons }} / {{ totalLessons }} 课。进度保存在当前浏览器中，不会上传个人数据。
        </p>
      </div>
      <div class="progress-ring" :style="{ '--progress': `${overallPercent * 3.6}deg` }">
        <div>
          <strong>{{ overallPercent }}%</strong>
          <span>总进度</span>
        </div>
      </div>
    </section>

    <div class="dashboard-stats">
      <div class="dashboard-stat">
        <span>完成课程</span>
        <strong>{{ completedLessons }}<small>/{{ totalLessons }}</small></strong>
      </div>
      <div class="dashboard-stat">
        <span>已学习时长</span>
        <strong>{{ formatMinutes(completedMinutes) }}</strong>
      </div>
      <div class="dashboard-stat">
        <span>测验正确率</span>
        <strong>
          {{ quizStats.answered ? Math.round((quizStats.correct / quizStats.answered) * 100) : 0 }}%
        </strong>
        <small>{{ quizStats.correct }} / {{ quizStats.answered }} 题</small>
      </div>
      <div class="dashboard-stat">
        <span>全部内容预计</span>
        <strong>{{ formatMinutes(totalMinutes) }}</strong>
      </div>
      <div class="dashboard-stat">
        <span>作业结构达标</span>
        <strong>{{ homeworkStats.ready }}<small>/{{ homeworkStats.total }}</small></strong>
        <small>仍需人工复核</small>
      </div>
      <div class="dashboard-stat">
        <span>到期复习</span>
        <strong>{{ dueReviews.length }}</strong>
        <small>按 1 / 7 / 30 / 90 天复习</small>
      </div>
    </div>

    <section class="continue-card">
      <div class="continue-card__copy">
        <span class="eyebrow">{{ overallPercent === 100 ? 'REVIEW' : 'CONTINUE' }}</span>
        <h3>{{ currentLesson.title }}</h3>
        <p>预计阅读与练习 {{ currentLesson.minutes }} 分钟</p>
      </div>
      <a class="course-button" :href="currentLesson.path">
        <span>{{ overallPercent === 100 ? '重新复习' : '继续学习' }}</span>
      </a>
    </section>

    <section class="review-queue">
      <div>
        <span class="eyebrow">SPACED REVIEW</span>
        <h3>间隔复习</h3>
        <p v-if="dueReviews.length === 0">暂无到期内容。完成一课后，将在第 1、7、30、90 天提醒复习。</p>
      </div>
      <div v-if="dueReviews.length > 0" class="review-queue__items">
        <article v-for="lesson in dueReviews" :key="lesson.id">
          <div>
            <strong>{{ lesson.title }}</strong>
            <span>第 {{ (reviews[lesson.id]?.count ?? 0) + 1 }} 次复习</span>
          </div>
          <a :href="lesson.path">打开课程</a>
          <button type="button" @click="markReviewed(lesson.id)">完成复习</button>
        </article>
      </div>
    </section>

    <section class="stage-progress-list">
      <article v-for="stage in courseStages" :key="stage.id" class="stage-progress">
        <div class="stage-progress__header">
          <span class="stage-progress__number" :style="{ color: stage.color }">{{ stage.number }}</span>
          <div>
            <h3>{{ stage.title }}</h3>
            <p>{{ stage.subtitle }}</p>
          </div>
          <strong>{{ stageCompleted(stage.id) }}/{{ stage.lessons.length }}</strong>
        </div>
        <div class="stage-progress__track">
          <span :style="{ width: `${stagePercent(stage.id)}%`, background: stage.color }"></span>
        </div>
        <div class="stage-progress__lessons">
          <a
            v-for="lesson in stage.lessons"
            :key="lesson.id"
            :href="lesson.path"
            :class="{ 'is-complete': progress[lesson.id]?.complete }"
          >
            <span>{{ progress[lesson.id]?.complete ? '✓' : '○' }}</span>
            {{ lesson.title }}
          </a>
        </div>
      </article>
    </section>

    <p class="dashboard-note">
      进度来自每课底部的“本课完成清单”；只有全部勾选，该课才计为完成。更换浏览器或清除站点数据会重置进度。
    </p>
  </div>
</template>
