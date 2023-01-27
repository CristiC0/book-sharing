import type { Ref } from "vue";
import { ref, watchEffect } from "vue";

const usePagination = (list: object[], nrOfItemsOnPage: number) => {
  const pages: Ref<number[]> = ref([]);
  const startBookIndex = ref(0);
  const endBookIndex = ref(0);
  const elementsOnCurrentPage: Ref<object[]> = ref([]);
  const currentPage = ref(1);

  if (!list.length) return null;

  const nrOfPages = Math.ceil(list.length / nrOfItemsOnPage);

  const changePageNumber = (newPageNumber: number) => {
    currentPage.value = newPageNumber;
  };

  const nextPage = () => {
    if (currentPage.value < nrOfPages) changePageNumber(currentPage.value + 1);
  };

  const previousPage = () => {
    if (currentPage.value > 1) changePageNumber(currentPage.value - 1);
  };

  watchEffect(() => {
    const startPage =
      nrOfPages < 5 || currentPage.value <= 3
        ? 1
        : currentPage.value >= nrOfPages - 2
        ? nrOfPages - 4
        : currentPage.value - 2;
    const endPage =
      nrOfPages < 5 || currentPage.value + 2 > nrOfPages
        ? nrOfPages
        : currentPage.value <= 3
        ? 5
        : currentPage.value + 2;

    pages.value = [];
    for (let i = startPage; i <= endPage; i++) pages.value.push(i);

    startBookIndex.value =
      currentPage.value === 1 ? 0 : (currentPage.value - 1) * nrOfItemsOnPage;
    endBookIndex.value =
      currentPage.value * nrOfItemsOnPage - 1 < list.length
        ? currentPage.value * nrOfItemsOnPage - 1
        : list.length;

    elementsOnCurrentPage.value = list.slice(
      startBookIndex.value,
      endBookIndex.value + 1
    );
  });
  return {
    nrOfPages,
    pages,
    elementsOnCurrentPage,
    changePageNumber,
    currentPage,
    nextPage,
    previousPage,
  };
};

export default usePagination;
