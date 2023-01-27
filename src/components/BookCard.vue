<template>
  <div class="d-flex flex-column g` card-wrapper">
    <div class="cover d-flex justify-content-center align-items-center">
      <img
        class="w-100"
        :class="{ clickable: props.clickable }"
        :src="`data:image/jpg;base64, ${props.book.image}`"
        alt=""
        @click="openBookDetailPage"
      />
    </div>
    <div class="d-flex flex-column">
      <p
        class="text-center overflow-hidden m-1"
        :class="{ clickable }"
        @click="openBookDetailPage"
      >
        {{ props.book.title }}
      </p>
      <Badge
        v-if="showStatus && !props.book.isApproved"
        text="Pending Approval"
        class="bg-warning w-60 mx-auto rounded fs-12"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Book } from "@/types/Book";
import Badge from "./Badge.vue";
import router from "@/router";
const props = defineProps<{
  book: Book;
  clickable: boolean;
  showStatus?: boolean;
}>();

const openBookDetailPage = () => {
  if (props.clickable) router.push(`/book/${props.book.id}`);
};
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
.cover {
  height: 15rem;
}
img {
  max-height: 100%;
  object-fit: contain;
}
</style>
