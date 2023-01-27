<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed, reactive } from "vue";
import { useFetch } from "@/helpers/useFetch";
import type { BookDetail } from "@/types/BookDetail";
import Badge from "@/components/Badge.vue";
import { useProfileStore } from "@/stores/ProfileStore";
import EditBookModal from "@/components/EditBookModal.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { dd_mm_yyyy } from "@/helpers/useFormatDate";
const authStore = useAuthStore();
const profileStore = useProfileStore();

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;
const book = ref<BookDetail | null>(null);
const authors = ref("");
const loading = ref(true);
const assignmets = reactive({
  activeUserAssignments: [],
  pendingUserAssignments: [],
});
const errors = reactive({
  activeNr: 0,
  pendingNr: 0,
  maxActive: false,
  maxPending: false,
});
onMounted(async () => {
  await getData();
  await getAssignments();
  validate(errors.activeNr, errors.pendingNr);
  loading.value = false;
});

const validate = (activeNr: number, pendingNr: number) => {
  errors.maxActive = activeNr >= 2;
  errors.maxPending = pendingNr >= 1;
};

const getAssignments = async () => {
  await Promise.all([
    useFetch.getAuthorized("/api/Assignment/assignments?status=pending"),
    useFetch.getAuthorized("/api/Assignment/assignments?status=active"),
  ]).then(async ([responsePending, repsonseActive]) => {
    assignmets.pendingUserAssignments = await responsePending.json();
    assignmets.activeUserAssignments = await repsonseActive.json();
  });
  errors.activeNr = assignmets.activeUserAssignments.length;
  errors.pendingNr = assignmets.pendingUserAssignments.length;
};

const deleteBook = () => {
  useFetch.deleteAuthorized(`/api/Books/${id}`).catch(console.error);
  router.go(-1);
};

const getData = async () => {
  book.value = await useFetch
    .getAuthorized(`/api/Books/${id}/details`)
    .then((response) => response.json())
    .catch(console.error);

  authors.value = book.value
    ? book.value.authors.reduce((acc, author) => {
        const authorName = `${author.firstName} ${author.lastName}`;
        return acc ? `${acc},${authorName}` : authorName;
      }, "")
    : "";
};

const succesBut = ref();
const errorBut = ref();

const assign = () => {
  validate(errors.activeNr, errors.pendingNr);
  if (errors.maxPending) {
    succesBut.value.click();
    return;
  }

  useFetch
    .postAuthorized("/api/Assignment", {
      bookId: id,
      userId: authStore.user?.userId,
    })
    .then((response) => {
      if (response.ok) succesBut.value.click();
      else errorBut.value.click();
    })
    .catch(console.error);
};

const endDate = computed(() => {
  const now = new Date();
  now.setDate(now.getDate() + 14);
  return now;
});
</script>

<template>
  <NavbarComponent />
  <div class="container mt-5" v-if="book">
    <div class="row">
      <div class="col-12 col-sm-4 d-sm-flex d-block justify-content-center">
        <img
          class="img-fluid h-75 cover"
          :src="`data:image/jpg;base64,${book?.image}`"
        />
      </div>
      <div class="col-12 col-sm-8 mx-auto">
        <h1>{{ book?.title ?? "Unknown" }}</h1>
        <div class="container p-0 mt-3">
          <div class="row">
            <div class="col-6 d-flex flex-column gap-2">
              <div>
                <p class="fs-4 fw-bold m-0">Authors</p>
                <p>
                  {{ authors || "Unknown" }}
                </p>
              </div>
              <div>
                <p class="fs-4 fw-bold m-0">Genres</p>
                <div class="d-flex flex-wrap gap-2">
                  <Badge
                    v-for="(genre, index) in book?.genres"
                    :key="index"
                    :text="genre.name"
                    class="bg-primary rounded"
                  />
                </div>
              </div>
              <div>
                <p class="fs-4 fw-bold m-0">Availability</p>
                <div v-if="book">
                  <Badge
                    :text="book.isAvailable ? 'Free' : 'Busy'"
                    :class="`${
                      book.isAvailable ? 'bg-success' : 'bg-danger'
                    } rounded `"
                  />
                </div>
              </div>
            </div>
            <div class="col-6 d-flex flex-column gap-2">
              <div>
                <p class="fs-4 fw-bold m-0">Uploaded by</p>
                <p>{{ book?.uploadedBy?.userName ?? "Unknown" }}</p>
              </div>
              <div>
                <p class="fs-4 fw-bold m-0">Publication Date</p>
                <p v-if="book">
                  {{
                    book.publicationDate
                      ? new Date(book.publicationDate).toLocaleDateString(
                          "en-GB"
                        )
                      : "Unknown"
                  }}
                </p>
              </div>
              <div>
                <p class="fs-4 fw-bold m-0">Language</p>
                <p>{{ book?.language.name ?? "Unknown" }}</p>
              </div>
            </div>
            <div
              class="d-flex d-sm-block justify-content-between flex-wrap mt-4"
            >
              <button
                v-if="profileStore.isUploadedBook(id).value"
                class="col-5 col-sm-4 col-lg-2 btn btn-primary m-1"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#deleteModal"
              >
                Delete
              </button>
              <button
                v-if="profileStore.isUploadedBook(id).value"
                type="button"
                class="col-5 col-sm-4 col-lg-2 btn btn-primary m-1"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
              >
                Edit
              </button>

              <span
                data-bs-toggle="tooltip"
                :title="
                  errors.maxActive
                    ? 'You should have less than 2 assignments to Assign a book'
                    : ''
                "
              >
                <button
                  v-show="!loading"
                  type="button"
                  class="col-5 col-sm-5 col-lg-3 btn btn-primary m-1"
                  @click="assign"
                  :disabled="errors.maxActive"
                >
                  Assign to Me
                </button>
              </span>
              <button
                class="invisible"
                data-bs-toggle="modal"
                data-bs-target="#succes"
                ref="succesBut"
              ></button>
              <button
                class="invisible"
                data-bs-toggle="modal"
                data-bs-target="#error"
                ref="errorBut"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="profileStore.isUploadedBook(id)">
    <ModalComponent name="deleteModal">
      <template v-slot:title>Confirm Deletion </template>
      <template v-slot:body
        >Are you sure you want to delete this book?
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-primary"
          @click="deleteBook"
          data-bs-dismiss="modal"
        >
          Yes
        </button>
        <button class="btn" data-bs-dismiss="modal">No</button>
      </template>
    </ModalComponent>

    <EditBookModal
      v-if="book"
      :id="id"
      :book="book"
      name="editModal"
      @update="getData"
    />
  </div>
  <ModalComponent name="succes">
    <template v-slot:title>
      <span v-if="errors.maxPending">Unsuccessful assignment! </span>
      <span v-else>Successful assignment</span>
    </template>
    <template v-slot:body>
      <span v-if="errors.maxPending"
        >You already have one pending assignment
      </span>
      <span v-else
        >Book was successfully assigned to
        {{ authStore.user?.username ?? "you" }}. Your assignment ends at:
        {{ dd_mm_yyyy(endDate, ".") }} Please wait for the Administrator
        approval</span
      >
    </template>
    <template v-slot:footer>
      <button class="btn" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalComponent>
  <ModalComponent name="error">
    <template v-slot:title> Unsuccessful assignment!</template>
    <template v-slot:body
      >The book is already assigned to another user for the current period of
      time, please join the queue by clicking on Add to queue
    </template>
    <template v-slot:footer>
      <button class="btn" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalComponent>
</template>

<style scoped>
.custom-tooltip {
  --bs-tooltip-bg: var(--bs-primary);
}

.invisible {
  width: 0;
  height: 0;
}
.cover {
  max-height: 30rem;
  object-fit: cover;
}
</style>
