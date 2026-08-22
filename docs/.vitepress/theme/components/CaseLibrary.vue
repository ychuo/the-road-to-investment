<script setup lang="ts">
import { courseStages } from '../course-data'
import { lessonCases } from '../case-data'

function caseFor(path: string) {
  return lessonCases[`${path.replace(/^\//, '')}.md`]
}
</script>

<template>
  <div class="case-library">
    <section v-for="stage in courseStages" :key="stage.id" class="case-library__stage">
      <div class="case-library__stage-header">
        <span :style="{ color: stage.color }">{{ stage.number }}</span>
        <div>
          <h2>{{ stage.title }}</h2>
          <p>{{ stage.subtitle }}</p>
        </div>
      </div>
      <div class="case-library__items">
        <a
          v-for="lesson in stage.lessons"
          :key="lesson.id"
          :href="`${lesson.path}#applied-case`"
        >
          <span>{{ lesson.title }}</span>
          <strong>{{ caseFor(lesson.path)?.title ?? '案例待补充' }}</strong>
          <small>查看案例 →</small>
        </a>
      </div>
    </section>
  </div>
</template>

