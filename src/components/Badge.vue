<script setup lang="ts">
const props = defineProps<{ text: string; color?: string; class?: string }>();
</script>

<template>
  <div
    class="badge p-2"
    :class="`${props.class}`"
    :style="`background-color:${props.color}`"
  >
    {{ props.text }}
  </div>
</template>
