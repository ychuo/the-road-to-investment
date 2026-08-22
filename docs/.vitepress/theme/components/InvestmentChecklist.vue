<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { inBrowser } from 'vitepress'

type ChecklistItem =
  | string
  | {
      id?: string
      text: string
    }

const props = withDefaults(
  defineProps<{
    id: string
    title?: string
    items: ChecklistItem[]
  }>(),
  {
    title: '本课完成清单'
  }
)

const checked = ref<Record<string, boolean>>({})
const storageKey = computed(() => `investment-road:checklist:${props.id}`)
const normalizedItems = computed(() =>
  props.items.map((item, index) => ({
    id: typeof item === 'string' ? String(index) : item.id ?? String(index),
    text: typeof item === 'string' ? item : item.text
  }))
)
const finishedCount = computed(
  () => normalizedItems.value.filter((item) => checked.value[item.id]).length
)
const progress = computed(() =>
  normalizedItems.value.length === 0
    ? 0
    : Math.round((finishedCount.value / normalizedItems.value.length) * 100)
)

onMounted(() => {
  const saved = window.localStorage.getItem(storageKey.value)
  if (!saved) return

  try {
    checked.value = JSON.parse(saved)
    publishProgress()
  } catch {
    window.localStorage.removeItem(storageKey.value)
  }
})

watch(
  checked,
  (value) => {
    if (inBrowser) {
      window.localStorage.setItem(storageKey.value, JSON.stringify(value))
      publishProgress()
    }
  },
  { deep: true }
)

function reset() {
  checked.value = {}
}

function publishProgress() {
  if (!inBrowser) return

  const complete =
    normalizedItems.value.length > 0 &&
    normalizedItems.value.every((item) => checked.value[item.id])
  const lessonProgressKey = 'investment-road:lesson-progress'
  let lessonProgress: Record<string, { complete: boolean; completedAt: string | null }> = {}

  try {
    lessonProgress = JSON.parse(window.localStorage.getItem(lessonProgressKey) ?? '{}')
  } catch {
    lessonProgress = {}
  }

  lessonProgress[props.id] = {
    complete,
    completedAt: complete
      ? lessonProgress[props.id]?.completedAt ?? new Date().toISOString()
      : null
  }
  window.localStorage.setItem(lessonProgressKey, JSON.stringify(lessonProgress))
  window.dispatchEvent(new CustomEvent('investment-progress-updated'))
}
</script>

<template>
  <section class="learning-checklist" aria-labelledby="checklist-title">
    <div class="learning-checklist__header">
      <div>
        <span class="eyebrow">LEARNING CHECKPOINT</span>
        <h3 id="checklist-title">{{ title }}</h3>
      </div>
      <span class="learning-checklist__count">{{ finishedCount }}/{{ normalizedItems.length }}</span>
    </div>

    <div
      class="learning-checklist__progress"
      role="progressbar"
      aria-label="课程完成度"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span :style="{ width: `${progress}%` }"></span>
    </div>

    <label
      v-for="item in normalizedItems"
      :key="item.id"
      class="learning-checklist__item"
      :class="{ 'is-complete': checked[item.id] }"
    >
      <input v-model="checked[item.id]" type="checkbox" />
      <span class="custom-check" aria-hidden="true"></span>
      <span>{{ item.text }}</span>
    </label>

    <button v-if="finishedCount > 0" class="text-button" type="button" @click="reset">
      重置本课进度
    </button>
  </section>
</template>
