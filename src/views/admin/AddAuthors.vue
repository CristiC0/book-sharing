<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import ActionButton from "@/components/ActionButton.vue";
import { useFetch } from "@/helpers/useFetch";
import usePagination from "@/helpers/usePagination";
import PaginationComponent from "@/components/PaginationComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import type { Author } from "@/types/Author";
import AuthorNameModal from "@/components/AuthorNameModal.vue";

const pagination = ref();
const selectedAuthor = ref<Author>({
  id: "",
  firstName: "",
  lastName: "",
  proposedBy: "",
  userName: "",
  similarWithName: "",
  similarWithId: "",
});
const allAuthors = ref<Author[]>();
const successfulChange = ref("");

onMounted(async () => {
  await getPendingAuthors();
});

const getPendingAuthors = async () => {
  allAuthors.value = await useFetch
    .getAuthorized("/api/Authors/pending")
    .then((response) => response.json())
    .catch(console.error);

  pagination.value = usePagination(allAuthors.value as object[], 12);
};

const deleteAuthor = () => {
  useFetch
    .deleteAuthorized(`/api/Authors/${selectedAuthor.value.id}`)
    .catch(console.error);

  savePage(pagination.value.currentPage);
};

const approveAuthor = () => {
  useFetch
    .postAuthorized(`/api/Authors/${selectedAuthor.value.id}/approve`)
    .catch(console.error);

  savePage(pagination.value.currentPage);
};

const savePage = (currentPage: number) => {
  allAuthors.value = allAuthors.value?.filter(
    (author) => author.id !== selectedAuthor.value.id
  );
  pagination.value = usePagination(allAuthors.value as object[], 12);
  pagination.value.changePageNumber(currentPage);
};

const update = async (currentPage: number) => {
  await getPendingAuthors();
  if (currentPage <= pagination.value.nrOfPages)
    pagination.value.changePageNumber(currentPage);
};

const chooseTheSimilarAuthor = async () => {
  await useFetch
    .postAuthorized(
      `/api/Authors/authors/${selectedAuthor.value.id}/reuse/${selectedAuthor.value.similarWithId}`
    )
    .catch(console.error);
  deleteAuthor();
};
const success = (message: string) => {
  successfulChange.value = message;
  setTimeout(() => {
    successfulChange.value = "";
  }, 4000);
};
</script>
<template>
  <div class="container-fluid container-md">
    <div class="row d-flex flex-column-reverse flex-lg-row">
      <div class="col-12 col-lg-9">
        <div class="table-responsive">
          <table class="table text-center align-middle">
            <thead>
              <tr class="border-ottom border-primary">
                <th scope="col" class="col-2">AUTHOR</th>
                <th scope="col" class="col-2">PROPOSED BY</th>
                <th scope="col" class="col-4">ACTIONS</th>
                <th scope="col" class="col-5"></th>
              </tr>
            </thead>
            <tbody v-if="pagination">
              <tr
                v-for="(author, index) in pagination.elementsOnCurrentPage"
                :key="index"
              >
                <th scope="row">
                  {{ author.firstName + " " + author.lastName }}
                </th>
                <td>{{ author.userName }}</td>
                <td>
                  <div class="d-flex gap-1 justify-content-center">
                    <ActionButton
                      @click="selectedAuthor = author"
                      :class="'btn-primary px-3 col-4'"
                      text="ADD"
                      data-bs-toggle="modal"
                      data-bs-target="#addAuthor"
                    />
                    <ActionButton
                      @click="selectedAuthor = author"
                      :class="'btn-warning px-3 col-4'"
                      text="EDIT"
                      data-bs-toggle="modal"
                      data-bs-target="#edit"
                    />
                    <ActionButton
                      :class="'btn-danger px-3 col-4'"
                      text="DELETE"
                      @click="selectedAuthor = author"
                      data-bs-toggle="modal"
                      data-bs-target="#delete"
                    />
                  </div>
                </td>
                <td>
                  <span
                    v-if="author.similarWithName"
                    @click="selectedAuthor = author"
                    class="click-text"
                    data-bs-toggle="modal"
                    data-bs-target="#changeWithSimilar"
                  >
                    There is a similar author
                    <span class="text-decoration-underline">
                      {{ author.similarWithName }}
                    </span>
                    in the system.
                    <a
                      class="text-decoration-underline remove-link"
                      @click="selectedAuthor = author"
                      data-bs-toggle="modal"
                      data-bs-target="#delete"
                      >Would you like to use it?</a
                    >
                  </span>
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
      <div
        class="col col-lg-3 d-flex align-items-center justify-content-center mt-2"
      >
        <button
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#add"
        >
          ADD AUTHOR
        </button>
      </div>
    </div>
  </div>
  <AuthorNameModal
    name="add"
    title="Add Author"
    :add="true"
    @success="success"
  />
  <AuthorNameModal
    name="edit"
    title="Edit Author"
    :add="false"
    :id="selectedAuthor?.id"
    @success="success"
    @update="update(pagination.currentPage)"
  />

  <ModalComponent name="delete">
    <template v-slot:title>Confirm </template>
    <template v-slot:body
      >Are you sure you want to delete this author?
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        data-bs-dismiss="modal"
        @click="deleteAuthor"
      >
        Yes
      </button>
      <button class="btn" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>

  <ModalComponent name="addAuthor">
    <template v-slot:title>Confirm </template>
    <template v-slot:body>Are you sure you want to add this author? </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        data-bs-dismiss="modal"
        @click="approveAuthor"
      >
        Yes
      </button>
      <button class="btn" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>

  <ModalComponent name="changeWithSimilar">
    <template v-slot:title>Use similar author name </template>
    <template v-slot:body>Are you sure you want to use this author? </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        data-bs-dismiss="modal"
        @click="chooseTheSimilarAuthor"
      >
        Yes
      </button>
      <button class="btn" data-bs-dismiss="modal">No</button>
    </template>
  </ModalComponent>

  <div
    v-if="successfulChange"
    class="alert alert-success popup w-45 d-flex justify-content-evenly align-items-center"
    role="alert"
  >
    <div>{{ successfulChange }}</div>
    <button
      type="button"
      class="btn-close"
      @click="successfulChange = ''"
      aria-label="Close"
    ></button>
  </div>
</template>
<style scoped>
.click-text {
  cursor: pointer;
}
.popup {
  position: fixed;
  top: 5em;
  right: 0;
}
</style>
