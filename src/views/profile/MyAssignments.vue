<script setup lang="ts">
import type { Assignment } from "@/types/Assignment";
import Badge from "@/components/Badge.vue";
import ActionButton from "@/components/ActionButton.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import usePagination from "@/helpers/usePagination";
import { useProfileStore } from "@/stores/ProfileStore";
import { dd_mm_yyyy } from "@/helpers/useFormatDate";
const profileStore = useProfileStore();
const pagination = usePagination(
  profileStore.state.assignments as object[],
  12
);

enum Status {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  QUEUED = "QUEUED",
  REJECTED = "REJECTED",
}

const createColorBasedOnStatus = (status: Status) => {
  if ([Status.ACTIVE, Status.COMPLETED].includes(status)) return "bg-success";
  if ([Status.PENDING, Status.QUEUED].includes(status)) return "bg-warning";
  return "bg-danger";
};
</script>
<template>
  <div class="table-responsive">
    <table class="table text-center">
      <thead>
        <tr>
          <th scope="col">BOOK</th>
          <th scope="col">START DATE</th>
          <th scope="col">END DATE</th>
          <th scope="col">STATUS</th>
          <th scope="col">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="pagination"
          v-for="(assignment, index) in pagination.elementsOnCurrentPage.value"
          :key="index"
        >
          <th scope="row">{{ (assignment as Assignment).bookTitle }}</th>
          <td>
            {{
              dd_mm_yyyy(new Date((assignment as Assignment).startDate), ".")
            }}
          </td>
          <td>
            {{ dd_mm_yyyy(new Date((assignment as Assignment).endDate), ".") }}
          </td>
          <td class="align-middle">
            <Badge
              class="w-75"
              :text="(assignment as Assignment).status.toUpperCase()"
              :class="createColorBasedOnStatus((assignment as Assignment).status.toUpperCase() as Status)"
            />
          </td>
          <td>
            <ActionButton
              class="w-75 btn-sm btn-primary"
              :text="(assignment as
            Assignment).status.toUpperCase() === 'ACTIVE' ? 'EXTEND DEADLINE' :
            'CHANGE TIME RANGE' "
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationComponent
    v-if="pagination"
    :current-page="pagination.currentPage.value"
    :pageNumbers="pagination.pages.value"
    :nrOfPages="pagination.nrOfPages"
    :next="pagination.nextPage"
    :prev="pagination.previousPage"
    @changePageNumber="pagination?.changePageNumber"
  />
</template>
<style></style>
