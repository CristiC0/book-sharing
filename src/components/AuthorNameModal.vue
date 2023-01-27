<script setup lang="ts">
import { validate, areInputsValid } from "@/helpers/useFormValidation";
import ModalComponent from "./ModalComponent.vue";
import { reactive, ref } from "vue";
import { validatorsAuthorName } from "@/helpers/useFormValidation";
import { useFetch } from "@/helpers/useFetch";

const errors = reactive({
  firstName: false,
  lastName: false,
});

const emit = defineEmits(["update", "success"]);
const props = defineProps<{
  name: string;
  add?: boolean;
  id?: string;
  title: string;
}>();

const firstName = ref<string>("");
const lastName = ref<string>("");

const buttonClose = ref();
const validateInput = () => {
  const test = validate(errors);
  test(validatorsAuthorName, "firstName", firstName.value);
  test(validatorsAuthorName, "lastName", lastName.value);
};

const authorAction = () => {
  validateInput();
  if (!areInputsValid(errors)) return;

  if (props.add)
    useFetch
      .postAuthorized("/api/Authors", {
        firstName: firstName.value,
        lastName: lastName.value,
      })
      .catch(console.error);
  else
    useFetch
      .put(`/api/Authors/${props.id}`, {
        firstName: firstName.value,
        lastName: lastName.value,
      })
      .catch(console.error);

  emit(
    "success",
    props.add
      ? "New author successfully added to the system"
      : "Author details updated successfully"
  );
  buttonClose.value.click();
  resetInputs();
  emit("update");
};

const resetInputs = () => {
  errors.firstName = false;
  errors.lastName = false;
};
</script>

<template>
  <ModalComponent :name="props.name">
    <template v-slot:title>{{ props.title }} </template>
    <template v-slot:body
      ><form class="d-flex flex-column g-3">
        <div class="form-group form__input mb-3">
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.firstName }"
            id="username"
            placeholder="First Name"
            v-model="firstName"
          />
          <div class="invalid-feedback" v-if="errors.firstName">
            Should be from 3 to 100 letters
          </div>
        </div>
        <div class="form-group form__input">
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="Last Name"
            v-model="lastName"
            :class="{ 'is-invalid': errors.lastName }"
          />
          <div class="invalid-feedback" v-if="errors.lastName">
            Should be from 3 to 100 letters
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="authorAction">
        Save Changes
      </button>
      <button
        class="btn"
        data-bs-dismiss="modal"
        @click="resetInputs"
        ref="buttonClose"
      >
        Close
      </button>
    </template>
  </ModalComponent>
</template>
