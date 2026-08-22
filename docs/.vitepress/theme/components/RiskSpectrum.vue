<script setup lang="ts">
withDefaults(
  defineProps<{
    position?: number
    left?: string
    right?: string
    label?: string
  }>(),
  {
    position: 50,
    left: '低波动 / 低预期收益',
    right: '高波动 / 高预期收益',
    label: '风险与收益的位置'
  }
)
</script>

<template>
  <figure class="risk-spectrum">
    <figcaption>{{ label }}</figcaption>
    <div class="risk-spectrum__track">
      <span class="risk-spectrum__marker" :style="{ left: `${position}%` }">
        <span>你在这里</span>
      </span>
    </div>
    <div class="risk-spectrum__labels">
      <span>{{ left }}</span>
      <span>{{ right }}</span>
    </div>
  </figure>
</template>

