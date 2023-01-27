<script setup lang="ts">
const props = defineProps<{ text: string; class?: string }>();
</script>

<template>
  <button class="btn p-1" :class="props.class">
    {{ props.text }}
  </button>
</template>
