import type { Book } from "@/types/Book";
import type { Assignment } from "@/types/Assignment";
import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { useFetch } from "@/helpers/useFetch";
import { useAuthStore } from "@/stores/AuthStore";

type stateType = {
  uploadedBooks: Book[];
  wantedBooks: Book[];
  assignments: Assignment[];
  [key: string]: Assignment[] | Book[];
};

export const useProfileStore = defineStore("ProfileStore", () => {
  const { isAdmin } = useAuthStore();

  const state = reactive<stateType>({
    uploadedBooks: [],
    wantedBooks: [],
    assignments: [],
  });

  const getList = (list: string, url: string) => {
    return async () =>
      await useFetch
        .getAuthorized(url)
        .then((response) => response.json())
        .then((data) => (state[list] = data))
        .catch(console.error);
  };

  const getUploadedBooks = getList("uploadedBooks", "/api/Books/uploaded");

  const getWantedBooks = getList("wantedBooks", "/api/Books/wanted");

  const getAssignments = async () =>
    Promise.all([
      useFetch.getAuthorized("/api/Assignment/assignments?status=pending"),
      useFetch.getAuthorized("/api/Assignment/assignments?status=active"),
      useFetch.getAuthorized("/api/Assignment/assignments?status=rejected"),
      useFetch.getAuthorized("/api/Assignment/assignments?status=completed"),
      useFetch.getAuthorized("/api/Assignment/assignments?status=queued"),
    ]).then(
      async ([
        responsePending,
        repsonseActive,
        responseRejected,
        responseCompleted,
        responseQueued,
      ]) => {
        state.assignments = [
          ...(await responsePending.json()),
          ...(await repsonseActive.json()),
          ...(await responseRejected.json()),
          ...(await responseCompleted.json()),
          ...(await responseQueued.json()),
        ];
      }
    );

  const addUploadedBook = (book: Book, newAuthor: boolean) => {
    state.uploadedBooks.push({ ...book, isApproved: isAdmin || !newAuthor });
  };

  const isUploadedBook = (id: string) =>
    computed(() => {
      if (state.uploadedBooks.length === 0)
        (async () => {
          await getUploadedBooks();
        })();
      return state.uploadedBooks.some((book) => book.id === id);
    });

  const deleteAssignment = (id: string) =>
    (state.assignments = state.assignments.filter(
      (assignment) => assignment.id !== id
    ));

  const fetchProfile = async () => {
    await Promise.allSettled([
      getUploadedBooks(),
      getWantedBooks(),
      getAssignments(),
    ]);
  };

  return {
    state,
    addUploadedBook,
    isUploadedBook,
    getUploadedBooks,
    getWantedBooks,
    getAssignments,
    fetchProfile,
    deleteAssignment,
  };
});
