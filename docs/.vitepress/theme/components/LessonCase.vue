<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { lessonCases } from '../case-data'

const { page } = useData()
const lessonCase = computed(() => lessonCases[page.value.relativePath])
</script>

<template>
  <section v-if="lessonCase" id="applied-case" class="lesson-case" tabindex="-1">
    <span class="eyebrow">APPLIED CASE · 虚构教学案例</span>
    <h2>案例：{{ lessonCase.title }}</h2>
    <p>{{ lessonCase.scenario }}</p>
    <div class="lesson-case__question">
      <strong>你的任务</strong>
      <p>{{ lessonCase.question }}</p>
    </div>
    <details>
      <summary>完成思考后查看分析</summary>
      <ul>
        <li v-for="point in lessonCase.analysis" :key="point">{{ point }}</li>
      </ul>
      <p><strong>关键结论：</strong>{{ lessonCase.takeaway }}</p>
    </details>
  </section>
</template>
