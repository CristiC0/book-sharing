<script setup lang="ts">
const props = defineProps<{
  nrOfPages: number;
  pageNumbers: number[];
  currentPage: number;
  next: () => void;
  prev: () => void;
}>();
const emit = defineEmits(["changePageNumber"]);
const handleClick = (pageNumber: number) => {
  emit("changePageNumber", pageNumber);
};
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-8 my-5 mx-auto d-flex justify-content-center">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: props.currentPage === 1 }">
            <p class="page-link" @click="prev">&laquo;</p>
          </li>

          <li
            class="page-item"
            v-for="pageNumber in pageNumbers"
            :key="pageNumber"
            :class="{ active: props.currentPage === pageNumber }"
          >
            <button @click="handleClick(pageNumber)" class="page-link">
              {{ pageNumber }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: props.currentPage === props.nrOfPages }"
          >
            <p class="page-link" @click="next">&raquo;</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-link {
  cursor: pointer;
}
</style>
