<script setup lang="ts">
import { onMounted, ref } from "vue";
import ActionButton from "@/components/ActionButton.vue";
import { useFetch } from "@/helpers/useFetch";
import { useProfileStore } from "@/stores/ProfileStore";
import usePagination from "@/helpers/usePagination";
import PaginationComponent from "@/components/PaginationComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { dd_mm_yyyy } from "@/helpers/useFormatDate";
import type { PendingAssignment } from "@/types/Assignment";

const pagination = ref();
const selectedAssignmet = ref<PendingAssignment>();
const pendingAssignments = ref();
onMounted(async () => {
  await getData();
  pagination.value = usePagination(pendingAssignments.value as object[], 12);
});

const getData = () =>
  useFetch
    .getAuthorized("/api/Assignment/assignments/pending")
    .then((response) => response.json())
    .then((assignments) => (pendingAssignments.value = assignments))
    .catch(console.error);

const assignmentAction = (action: string) => {
  if (!selectedAssignmet.value) return;
  useFetch
    .postAuthorized(`/api/Assignment/${selectedAssignmet.value.id}/${action}`)
    .catch(console.error);

  const { currentPage } = pagination.value;
  pendingAssignments.value = pendingAssignments.value.filter(
    (assignment: PendingAssignment) =>
      assignment.id !== selectedAssignmet.value?.id
  );
  pagination.value = usePagination(pendingAssignments.value as object[], 12);
  pagination.value.changePageNumber(currentPage);
};

const formatDate = (date: string) => {
  return dd_mm_yyyy(new Date(date), ".");
};
</script>
<template>
  <div class="container-fluid container-lg">
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table text-center align-middle">
            <thead>
              <tr class="border-ottom border-primary">
                <th scope="col" class="col-2">BOOK</th>
                <th scope="col" class="col-2">REQUESTED BY</th>
                <th scope="col" class="col-2">REQUESTED AT</th>
                <th scope="col" class="col-2">ASSIGNMENT START DATE</th>
                <th scope="col" class="col-2">ASSIGNMENT END DATE</th>
                <th scope="col" class="col-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody v-if="pagination">
              <tr
                v-for="(assignment, index) in (pagination.elementsOnCurrentPage as PendingAssignment[])"
                :key="index"
              >
                <th scope="row">{{ assignment.bookName }}</th>
                <td>{{ assignment.requestedBy }}</td>
                <td>{{ formatDate(assignment.requestedAt) }}</td>
                <td>{{ formatDate(assignment.startDate) }}</td>
                <td>{{ formatDate(assignment.endDate) }}</td>
                <td>
                  <div class="d-flex gap-1 justify-content-center">
                    <ActionButton
                      class="btn-danger px-3 col-6"
                      text="REJECT"
                      data-bs-toggle="modal"
                      data-bs-target="#reject"
                      @click="selectedAssignmet = assignment"
                    />
                    <ActionButton
                      class="btn-primary px-3 col-6"
                      text="APPROVE"
                      data-bs-toggle="modal"
                      data-bs-target="#approve"
                      @click="selectedAssignmet = assignment"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PaginationComponent
          v-if="pagination"
          :current-page="pagination.currentPage"
          :pageNumbers="pagination.pages"
          :nrOfPages="pagination.nrOfPages"
          :next="pagination.nextPage"
          :prev="pagination.previousPage"
          @changePageNumber="pagination?.changePageNumber"
        />
      </div>
    </div>
  </div>

  <ModalComponent name="reject">
    <template v-slot:title>Confirm </template>
    <template v-slot:body
      >Are you sure you want to reject this Assignment?
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        data-bs-dismiss="modal"
        @click="assignmentAction('reject')"
      >
        Yes
      </button>
      <button class="btn" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>
  <ModalComponent name="approve">
    <template v-slot:title>Confirm </template>
    <template v-slot:body
      >Are you sure you want to approve this Assignment?
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        data-bs-dismiss="modal"
        @click="assignmentAction('approve')"
      >
        Yes
      </button>
      <button class="btn" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>
</template>
