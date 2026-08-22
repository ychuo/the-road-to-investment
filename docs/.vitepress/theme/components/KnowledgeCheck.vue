<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  id?: string
  question: string
  options: string[]
  answer: number
  explanation: string
}>()

const selected = ref<number | null>(null)
const submitted = ref(false)
const isCorrect = computed(() => selected.value === props.answer)
const storageKey = computed(() => {
  if (typeof window === 'undefined') return ''
  const id = props.id ?? window.location.pathname.replace(/^\/|\/$/g, '').replaceAll('/', '-')
  return `investment-road:quiz:${id}`
})

onMounted(() => {
  const saved = window.localStorage.getItem(storageKey.value)
  if (!saved) return
  try {
    const state = JSON.parse(saved)
    if (typeof state.selected === 'number') selected.value = state.selected
    submitted.value = Boolean(state.submitted)
  } catch {
    window.localStorage.removeItem(storageKey.value)
  }
})

function submit() {
  if (selected.value === null) return
  submitted.value = true

  window.localStorage.setItem(
    storageKey.value,
    JSON.stringify({
      selected: selected.value,
      submitted: true,
      correct: isCorrect.value,
      answeredAt: new Date().toISOString()
    })
  )
  window.dispatchEvent(new CustomEvent('investment-progress-updated'))
}

function retry() {
  selected.value = null
  submitted.value = false
  window.localStorage.removeItem(storageKey.value)
  window.dispatchEvent(new CustomEvent('investment-progress-updated'))
}
</script>

<template>
  <section class="knowledge-check">
    <span class="eyebrow">KNOWLEDGE CHECK</span>
    <h3>想一想</h3>
    <p class="knowledge-check__question">{{ question }}</p>

    <div class="knowledge-check__options">
      <label
        v-for="(option, index) in options"
        :key="option"
        class="knowledge-check__option"
        :class="{
          'is-selected': selected === index,
          'is-answer': submitted && index === answer,
          'is-wrong': submitted && selected === index && index !== answer
        }"
      >
        <input
          v-model="selected"
          type="radio"
          :value="index"
          :disabled="submitted"
        />
        <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
        <span>{{ option }}</span>
      </label>
    </div>

    <button v-if="!submitted" class="course-button" type="button" :disabled="selected === null" @click="submit">
      检查答案
    </button>
    <button v-else class="course-button course-button--quiet" type="button" @click="retry">
      再做一次
    </button>

    <div
      v-if="submitted"
      class="knowledge-check__result"
      :class="isCorrect ? 'is-correct' : 'is-incorrect'"
      role="status"
    >
      <strong>{{ isCorrect ? '答对了。' : '还差一点。' }}</strong>
      {{ explanation }}
    </div>
  </section>
</template>
