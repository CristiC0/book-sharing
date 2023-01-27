<script setup lang="ts">
import type { Book } from "@/types/Book";
import BookCard from "@/components/BookCard.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import usePagination from "@/helpers/usePagination";
import { useProfileStore } from "@/stores/ProfileStore";

const profileStore = useProfileStore();
const pagination = usePagination(
  profileStore.state.wantedBooks as object[],
  12
);
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="container col-12 col-md-8">
        <div class="row g-5">
          <BookCard
            :clickable="false"
            v-if="pagination"
            v-for="(book, index) in pagination.elementsOnCurrentPage.value"
            :key="index"
            :book="book as Book"
            class="col-6 col-md-4 col-lg-3"
          />
        </div>
      </div>
      <div class="col col-md-4"></div>
      <PaginationComponent
        v-if="pagination"
        :current-page="pagination.currentPage.value"
        :pageNumbers="pagination.pages.value"
        :nrOfPages="pagination.nrOfPages"
        :next="pagination.nextPage"
        :prev="pagination.previousPage"
        @changePageNumber="pagination?.changePageNumber"
      />
    </div>
  </div>
</template>
