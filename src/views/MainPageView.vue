<script setup lang="ts">
import { ref, onMounted } from "vue";
import NavbarComponent from "@/components/NavbarComponent.vue";
import type { Book } from "@/types/Book";
import PaginationComponent from "@/components/PaginationComponent.vue";
import usePagination from "@/helpers/usePagination";
import BookCard from "@/components/BookCard.vue";
import { useFetch } from "@/helpers/useFetch";

const books = ref<Book | []>([]);
const pagination = ref();

onMounted(async () => {
  books.value = await useFetch
    .getAuthorized("/api/books/approved")
    .then((response) => response.json());
  pagination.value = usePagination(books.value as object[], 12);
});
</script>
<template>
  <NavbarComponent />
  <div v-if="pagination" class="container-fluid container-lg mt-5">
    <div class="row">
      <div class="col-md-8 container m-0">
        <div class="row g-5">
          <BookCard
            v-for="(book, index) in pagination.elementsOnCurrentPage"
            :key="index"
            :book="(book as Book)"
            :clickable="true"
            class="col-6 col-md-4 col-lg-3"
          />
          <PaginationComponent
            v-if="pagination"
            :current-page="pagination.currentPage"
            :pageNumbers="pagination.pages"
            :nrOfPages="pagination.nrOfPages"
            :next="pagination.nextPage"
            :prev="pagination.previousPage"
            @changePageNumber="pagination.changePageNumber"
          />
        </div>
      </div>
      <div class="col-md-2"></div>
    </div>
  </div>
</template>
