<script setup lang="ts">
import type { Genre, Language, IEnumList } from "@/types/EnumList";
import type { Book } from "@/types/Book";
import type { Author } from "@/types/Author";
import { ref, reactive, onMounted } from "vue";
import { validate, areInputsValid } from "@/helpers/useFormValidation";
import { useFetch } from "@/helpers/useFetch";
import MultiSelectDropdown from "@/components/MultiSelectDropdown.vue";
import {
  validatorsTitle,
  validatorsNewAuthor,
  validatorsPublicationDate,
  validatorsUploadImage,
} from "@/helpers/useFormValidation";
import { isEmpty } from "@/helpers/useValidators";
import { yyyy_mm_dd } from "@/helpers/useFormatDate";
import { useProfileStore } from "@/stores/ProfileStore";
const { addUploadedBook } = useProfileStore();

const errors = reactive<{ [key: string]: boolean }>({
  title: false,
  genre: false,
  language: false,
  newAuthor: false,
  publicationDate: false,
  coverUpload: false,
  bothAuthorsInputs: false,
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
  title: "",
  authorIds: [],
  newAuthor: "",
  genreIds: [],
  languageId: "",
  publicationDate: null,
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

let image = reactive<ImagePropreties>({ ...defaultImageFields });

const allGenres = ref<Genre[]>([]);
const allLanguages = ref<Language[]>([]);
const allAuthors = ref<Author[]>([]);

const authorInput = ref();
const genreInput = ref();

const uploaded = ref(false);

onMounted(() => {
  const getList = (url: string) =>
    useFetch
      .getAuthorized(`/api/${url}`)
      .then((response) => response.json())
      .catch(console.error);

  Promise.all([
    getList("Genre"),
    getList("Language"),
    getList("Authors/approved"),
  ]).then(([genres, languages, authors]) => {
    allGenres.value = genres;
    allLanguages.value = languages;
    allAuthors.value = authors;
  });
});

const loadPreviewImage = async (event: Event) => {
  const uploadImageInput = event.target as HTMLInputElement;
  if (!uploadImageInput.files) return;

  const file: File = uploadImageInput.files[0];
  image.previewImage = URL.createObjectURL(file);
};

const addNewAuthor = async (newAuthor: string) => {
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

  await uploadImage();
  if (!areInputsValid(errors)) return;

  const newAuthorId = await addNewAuthor(bookFields.newAuthor)
    .then((response) => response?.json())
    .catch(console.error);
  if (newAuthorId) {
    bookFields.authorIds = [...bookFields.authorIds, newAuthorId.id];
    allAuthors.value.push(newAuthorId as Author);
  }

  const newBook: Book = await useFetch
    .postAuthorized("/api/Books", {
      authorIds: bookFields.authorIds,
      genreIds: bookFields.genreIds,
      languageId: bookFields.languageId,
      title: bookFields.title,
      image: image.imageName,
      publicationDate: bookFields.publicationDate,
    })
    .then((response: Response) => response.json())
    .catch(console.error);

  uploaded.value = true;
  setTimeout(() => (uploaded.value = false), 4000);
  addUploadedBook(newBook, !!bookFields.newAuthor);
  resetInputs();
};

const uploadImage = async () => {
  if (!imageUpload.value?.files || errors.coverUpload) {
    errors.coverUpload = true;
    return;
  }

  const nameOfUploadedImage = await useFetch
    .postAuthorizedFormData("/api/Images", {
      file: imageUpload.value.files[0],
    })
    .then((response) => response.text())
    .catch(console.error);

  if (!nameOfUploadedImage) {
    errors.coverUpload = true;
    return;
  }
  image.imageName = nameOfUploadedImage ? nameOfUploadedImage : "";
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

const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
  resetInputs();
};

const resetInputs = () => {
  Object.keys(errors).forEach((key) => (errors[key] = false));
  Object.assign(bookFields, { ...defaultBookFields });
  Object.assign(image, { ...defaultImageFields });
  authorInput.value.clearSelected();
  genreInput.value.clearSelected();
};
</script>
<template>
  <form
    @submit.prevent="handleSubmit"
    class="container-fluid container-xl my-5"
  >
    <div class="row gx-5">
      <div class="col-md-3 col-xl-2 col-6 align-self-center">
        <img
          v-if="image.previewImage"
          :src="image.previewImage"
          class="w-100"
        />
        <label class="btn btn-primary fs-7 fs-md-5 fs-lg-4 w-100 my-3">
          Cover/Image
          <input
            ref="imageUpload"
            type="file"
            accept="image/png,image/jpg,image/bmp"
            @change="loadPreviewImage"
          />
        </label>

        <div class="error-text" v-if="errors.coverUpload">
          Image should be smaller than 2000kb and with one of the extensions:
          .jpg, .png or .bmp
        </div>
      </div>

      <div class="col-md-5 col-6">
        <div class="form-group mb-3 w-100">
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

        <div class="d-block d-md-none">
          <div class="form-group mb-3">
            <label for="new-author">New Author</label>
            <input
              type="text"
              id="new-author"
              class="form-control"
              placeholder="Enter new author"
              :class="{ 'border border-danger is-invalid': errors.newAuthor }"
              v-model="bookFields.newAuthor"
            />
            <div class="invalid-feedback" v-if="errors.newAuthor">
              Should be from 7 to 71 letters. At least two words.
            </div>
            <small class="form-text text-muted">
              The request for a new Author will be submitted to Admin. Till
              then, the uploaded book will be saved as a draft.</small
            >
          </div>
        </div>

        <div class="form-group mb-3">
          <MultiSelectDropdown
            :class="'mb-3'"
            default-message="AUTHORS"
            :list="allAuthors.map(author=>({id:author.id,name:author.firstName+' '+author.lastName} as IEnumList)) "
            @get-selected-list="(list) => (bookFields.authorIds = list)"
            ref="authorInput"
          />
        </div>

        <MultiSelectDropdown
          :class="'mb-3'"
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
          <option value="">LANGUAGE</option>
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
          <label for="publication-date">Publication Date:</label>
          <input
            class="form-control w-auto"
            type="date"
            id="publication-date"
            @blur="(event:Event)=>
              bookFields.publicationDate = (
                event.target as HTMLInputElement
              ).valueAsDate
            "
            :value="yyyy_mm_dd(bookFields.publicationDate)"
            :class="{
              'border border-danger is-invalid': errors.publicationDate,
            }"
          />
          <div class="invalid-feedback" v-if="errors.publicationDate">
            Choose a date before today
          </div>
        </div>

        <div class="d-flex mt-5">
          <button type="submit" class="btn btn-primary col-5 col-sm-4 col-lg-3">
            Save
          </button>
          <button
            type="button"
            class="btn btn-primary mx-3 col-5 col-sm-4 col-lg-3"
            @click="close"
          >
            Cancel
          </button>
        </div>
      </div>

      <div class="col-md-4 col-xl-5 d-none d-md-block">
        <div class="form-group mt-5">
          <label for="new-author">New Author</label>
          <input
            type="text"
            id="new-author"
            class="form-control"
            placeholder="Enter new author"
            :class="{ 'border border-danger is-invalid': errors.newAuthor }"
            v-model="bookFields.newAuthor"
          />
          <div class="invalid-feedback" v-if="errors.newAuthor">
            Should be from 7 to 71 letters. At least two words.
          </div>
          <small class="form-text text-muted">
            The request for a new Author will be submitted to Admin. Till then,
            the uploaded book will be saved as a draft.</small
          >
        </div>
      </div>
    </div>
  </form>

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

  <div
    v-if="uploaded"
    class="alert alert-success fade show w-45 popup d-flex justify-content-evenly align-content-center g-2"
    role="alert"
  >
    <div>Book uploaded successfully</div>
    <button
      type="button"
      class="btn-close"
      @click="uploaded = false"
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
