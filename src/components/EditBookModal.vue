<script setup lang="ts">
import type { Genre, Language, IEnumList } from "@/types/EnumList";
import type { Author } from "@/types/Author";
import { validate, areInputsValid } from "@/helpers/useFormValidation";
import MultiSelectDropdown from "@/components/MultiSelectDropdown.vue";
import { useFetch } from "@/helpers/useFetch";
import { onMounted, ref, reactive } from "vue";
import {
  validatorsTitle,
  validatorsNewAuthor,
  validatorsPublicationDate,
  validatorsUploadImage,
} from "@/helpers/useFormValidation";
import { isEmpty } from "@/helpers/useValidators";
import { yyyy_mm_dd } from "@/helpers/useFormatDate";
import ModalComponent from "@/components/ModalComponent.vue";
import type { BookDetail } from "@/types/BookDetail";

const emits = defineEmits(["update"]);
const props = defineProps<{ id: string; book: BookDetail; name: string }>();
const errors = reactive<{ [key: string]: boolean }>({
  title: false,
  genre: false,
  language: false,
  newAuthor: false,
  publicationDate: false,
  coverUpload: false,
});

type BookFields = {
  title: string;
  authorIds: string[];
  newAuthor: string;
  genreIds: string[];
  languageId: string;
  publicationDate: Date | null;
};

const defaultBookFields: BookFields = {
  title: props.book.title,
  authorIds: props.book.authors.map((author) => author.id),
  newAuthor: "",
  genreIds: props.book.genres.map((genre) => genre.id),
  languageId: props.book.language.id,
  publicationDate: new Date(props.book.publicationDate),
};
const bookFields = reactive<BookFields>({ ...defaultBookFields });
type ImagePropreties = {
  previewImage: string;
  imageName: string;
};

const defaultImageFields: ImagePropreties = {
  previewImage: "",
  imageName: "",
};
const imageUpload = ref<HTMLInputElement | null>(null);

const image = reactive<ImagePropreties>({ ...defaultImageFields });

const allGenres = ref<Genre[]>([]);
const allLanguages = ref<Language[]>([]);
const allAuthors = ref<Author[]>([]);

const authorInput = ref();
const genreInput = ref();

const closeButton = ref();

onMounted(async () => {
  const getList = (url: string) =>
    useFetch
      .getAuthorized(`/api/${url}`)
      .then((response) => response.json())
      .catch(console.error);

  await Promise.all([
    getList("Genre"),
    getList("Language"),
    getList("Authors/approved"),
  ]).then(([genres, languages, authors]) => {
    allGenres.value = genres;
    allLanguages.value = languages;
    allAuthors.value = authors;
  });

  defaultMultipleValuesDropdown();
});

const defaultMultipleValuesDropdown = () => {
  authorInput.value.setDefaultValue(
    bookFields.authorIds,
    allAuthors.value.map((author) => ({
      id: author.id,
      name: `${author.firstName} ${author.lastName}`,
    }))
  );
  genreInput.value.setDefaultValue(bookFields.genreIds, allGenres.value);
};

const addNewAuthor = async () => {
  const { newAuthor } = bookFields;
  if (!newAuthor) return null;
  const name = newAuthor.split(" ");
  const [firstName, ...rest] = name;

  return await useFetch.postAuthorized("/api/Authors", {
    firstName,
    lastName: rest.join(" "),
  });
};

const handleSubmit = async () => {
  validateInput();

  if (!areInputsValid(errors)) return;
  await uploadImage();

  const newAuthorId = await addNewAuthor()
    .then((response) => response?.json())
    .catch(console.error);
  if (newAuthorId) {
    bookFields.authorIds.push(newAuthorId.id);
    allAuthors.value.push(newAuthorId as Author);
  }

  await useFetch
    .put("/api/Books", {
      authorIds: bookFields.authorIds,
      genreIds: bookFields.genreIds,
      languageId: bookFields.languageId,
      title: bookFields.title,
      image: image.imageName,
      publicationDate: bookFields.publicationDate,
      id: props.id,
    })
    .catch(console.error);

  emits("update");
  closeButton.value.click();
};

const uploadImage = async () => {
  if (!imageUpload.value?.files || errors.coverUpload) return;

  const nameOfUploadedImage = await useFetch
    .postAuthorizedFormData("/api/Images", {
      file: imageUpload.value.files[0],
    })
    .then((response) => response.text())
    .catch(console.error);

  image.imageName = nameOfUploadedImage ? nameOfUploadedImage : "";
};

const changeHandler = () => {
  image.previewImage = imageUpload?.value?.files?.[0].name ?? "";
};

const validateInput = () => {
  const test = validate(errors);
  test(validatorsTitle, "title", bookFields.title);

  if (bookFields.newAuthor)
    test(validatorsNewAuthor, "newAuthor", bookFields.newAuthor);

  test([isEmpty], "language", bookFields.languageId);

  const date = bookFields.publicationDate
    ? bookFields.publicationDate.toISOString()
    : "";
  test(validatorsPublicationDate, "publicationDate", date);

  if (imageUpload.value?.files?.length)
    test<File>(
      validatorsUploadImage,
      "coverUpload",
      imageUpload.value.files[0]
    );
  else errors.coverUpload = true;
  errors.genre = bookFields.genreIds.length === 0;

  errors.bothAuthorsInputs =
    bookFields.authorIds.length > 0 && bookFields.newAuthor !== "";
  if (errors.bothAuthorsInputs)
    setTimeout(() => (errors.bothAuthorsInputs = false), 4000);
};

const resetInputs = () => {
  Object.keys(errors).forEach((key) => (errors[key] = false));
  Object.assign(bookFields, { ...defaultBookFields });
  Object.assign(image, { ...defaultImageFields });
  defaultMultipleValuesDropdown();
};
</script>
<template>
  <ModalComponent :name="props.name">
    <template v-slot:title>Edit Book </template>
    <template v-slot:body>
      <form class="container-fluid container-lg my-1">
        <div class="form-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Title"
            v-model="bookFields.title"
            :class="{ 'border border-danger is-invalid': errors.title }"
          />
          <div class="invalid-feedback" v-if="errors.title">
            Should be from 1 to 70 alphanumeric characters and punctuation marks
          </div>
        </div>
        <div class="align-self-center mb-3">
          <label class="btn btn-primary w-100 my-1">
            {{ image.previewImage || " Choose Image" }}
            <input
              ref="imageUpload"
              type="file"
              accept="image/png,image/jpg,image/bmp"
              @change="changeHandler"
            />
          </label>

          <div class="error-text" v-if="errors.coverUpload">
            Image should be smaller than 2000kb and with one of the extensions:
            .jpg, .png or .bmp
          </div>
        </div>

        <div class="form-group mb-3">
          <MultiSelectDropdown
            class="mb-3"
            default-message="AUTHORS"
            :list="allAuthors.map(author=>({id:author.id,name:author.firstName+' '+author.lastName} as IEnumList)) "
            :selected-list="bookFields.authorIds"
            @get-selected-list="(list) => (bookFields.authorIds = list)"
            ref="authorInput"
          />
        </div>
        <div class="form-group mb-3">
          <input
            type="text"
            id="new-author"
            class="form-control"
            placeholder="Enter new author"
            :class="{ 'border border-danger is-invalid': errors.newAuthor }"
            v-model="bookFields.newAuthor"
          />
          <div class="invalid-feedback" v-if="errors.newAuthor">
            Should be from 7 to 71 letters. Two words that represent first and
            last name.
          </div>
          <small class="form-text text-muted">
            The request for a new Author will be submitted to Admin. Till then,
            the uploaded book will be saved as a draft.</small
          >
        </div>

        <MultiSelectDropdown
          class="mb-3"
          default-message="GENRES"
          :list="allGenres"
          @get-selected-list="(list) => (bookFields.genreIds = list)"
          :required="true"
          :error="errors.genre"
          ref="genreInput"
        />

        <select
          class="form-select"
          aria-label="languages"
          v-model="bookFields.languageId"
          :class="{ 'border border-danger is-invalid': errors.language }"
        >
          <option value="">LANGUAGES</option>
          <option
            v-if="allLanguages"
            v-for="(language, index) in allLanguages"
            :key="index"
            :value="language.id"
          >
            {{ language.name }}
          </option>
        </select>
        <div class="invalid-feedback" v-if="errors.language">
          Select a language
        </div>

        <div class="form-group my-3">
          <div class="d-flex align-items-center justify-content-between">
            <label for="publication-date" class="fs-5">Publication Date:</label>
            <input
              class="form-control w-auto"
              type="date"
              id="publication-date"
              @blur="(event:Event)=>
              bookFields.publicationDate = (
                event.target as HTMLInputElement
              ).valueAsDate"
              :value="yyyy_mm_dd(bookFields.publicationDate)"
              :class="{
                'border border-danger is-invalid': errors.publicationDate,
              }"
            />
          </div>
          <div class="invalid-feedback" v-if="errors.publicationDate">
            Choose a date before today
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" :onclick.prevent="handleSubmit">
        Save Changes
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        ref="closeButton"
        @click="resetInputs()"
      >
        Close
      </button>
    </template>
  </ModalComponent>
  <div
    v-if="errors.bothAuthorsInputs"
    class="alert alert-danger fade show w-45 popup d-flex justify-content-evenly align-content-center g-2"
    role="alert"
  >
    <div>Please select an existing author or add a new one</div>
    <button
      type="button"
      class="btn-close"
      @click="errors.bothAuthorsInputs = false"
      aria-label="Close"
    ></button>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
.error-text {
  color: #d9534f;
  font-size: 0.8em;
}
.popup {
  position: fixed;
  top: 5em;
  right: 0;
  animation: run 0.3s ease-in;
  z-index: 100;
}

@keyframes run {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
