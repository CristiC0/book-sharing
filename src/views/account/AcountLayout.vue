<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "@/stores/AuthStore";
import FormHeader from "@/components/FormHeader.vue";
const { user } = useAuthStore();

if (user) {
  router.push("/");
}
</script>
<template>
  <div class="wrapper">
    <FormHeader />
    <router-view />
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  display: flex;
}

@media (max-width: 1000px) {
  .wrapper {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .wrapper {
    font-size: 0.8rem;
  }
}
</style>
