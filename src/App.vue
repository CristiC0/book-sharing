<script setup lang="ts">
import { RouterView } from "vue-router";
import "bootswatch/dist/lux/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>
