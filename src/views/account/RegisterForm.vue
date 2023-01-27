<script setup lang="ts">
import {
  validate,
  areInputsValid,
  validatorsName,
  validatorsPassword,
  validatorsUsername,
  validatorsEmail,
} from "@/helpers/useFormValidation";
import { useAuthStore } from "@/stores/AuthStore";
import { ref, reactive } from "vue";
import type { Ref } from "vue";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const userName = ref("");
const password = ref("");
const repeatPassword = ref("");
const serverError: Ref<null | string> = ref(null);

const errors = reactive({
  firstName: false,
  lastName: false,
  userName: false,
  email: false,
  password: false,
  repeatPassword: false,
});

const handleSubmit = async () => {
  validateInput();
  if (areInputsValid(errors)) {
    try {
      const error = await authStore.register(
        firstName.value,
        lastName.value,
        userName.value,
        password.value,
        email.value
      );

      if (error) {
        userName.value = "";
        email.value = "";
        password.value = "";
        repeatPassword.value = "";
      }

      serverError.value = error ? error : "";
    } catch (error) {
      console.error(error);
    }
  }
};

const validateInput = () => {
  const test = validate(errors);
  test(validatorsName, "firstName", firstName.value);
  test(validatorsName, "lastName", lastName.value);
  test(validatorsUsername, "userName", userName.value);
  test(validatorsEmail, "email", email.value);
  test(validatorsPassword, "password", password.value);
  test(
    [
      (fieldValue: string) => password.value !== fieldValue,
      ...validatorsPassword,
    ],
    "repeatPassword",
    repeatPassword.value
  );
};
</script>

<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form__header">
        <p class="form__title">Sign Up</p>
        <div class="alert alert-danger form__status" v-if="serverError">
          {{ serverError }}
        </div>
        <div
          class="alert alert-success form__status"
          v-if="!serverError && serverError !== null"
        >
          New account has been successfully created.
        </div>
      </div>

      <div class="form__body">
        <div class="form-group form__input">
          <input
            type="text"
            class="form-control"
            :class="{ 'border border-danger is-invalid': errors.firstName }"
            id="first-name"
            placeholder="First name"
            v-model="firstName"
          />
          <div class="invalid-feedback" v-if="errors.firstName">
            Should be from 3 to 30 letters or symbols(space, -,')
          </div>
        </div>

        <div class="form-group form__input">
          <input
            type="text"
            class="form-control"
            :class="{ 'border border-danger is-invalid': errors.lastName }"
            id="last-name"
            placeholder="Last Name"
            v-model="lastName"
          />
          <div class="invalid-feedback" v-if="errors.lastName">
            Should be from 3 to 30 letters or symbols(space, -,')
          </div>
        </div>

        <div class="form-group form__input">
          <input
            type="text"
            class="form-control"
            :class="{ 'border border-danger is-invalid': errors.userName }"
            id="userName"
            placeholder="Enter username"
            v-model="userName"
          />
          <div class="invalid-feedback" v-if="errors.userName">
            Should be unique and from 3 to 30 alphanumeric characters or
            symbols(space, -,')
          </div>
        </div>

        <div class="form-group form__input">
          <input
            type="email"
            class="form-control"
            :class="{ 'border border-danger is-invalid': errors.email }"
            id="email"
            placeholder="Enter email"
            v-model="email"
          />
          <div class="invalid-feedback" v-if="errors.email">
            Should be unique, alphanumeric characters, dots, '@'
          </div>
          <small v-else class="form-text text-muted"
            >We'll never share your email with anyone else.</small
          >
        </div>

        <div class="form-group form__input">
          <input
            type="password"
            class="form-control"
            :class="{ 'border border-danger is-invalid': errors.password }"
            id="password"
            placeholder="Enter password"
            v-model="password"
          />
          <div class="invalid-feedback" v-if="errors.password">
            Should be from 3 to 30 alphanumeric characters
          </div>
        </div>

        <div class="form-group form__input">
          <input
            type="password"
            class="form-control"
            :class="{
              'border border-danger is-invalid': errors.repeatPassword,
            }"
            id="repeatPassword"
            placeholder="Repeat password"
            v-model="repeatPassword"
          />
          <div class="invalid-feedback" v-if="errors.repeatPassword">
            Should match the password
          </div>
        </div>

        <div class="form-group form-buttons">
          <button class="btn btn-primary col form__button" type="submit">
            Sign Up
          </button>
          <router-link class="btn btn-primary col form__button" to="login"
            >Log In</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-wrapper {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  width: 35rem;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--vt-c-black-soft);
}
.form__header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form__title {
  font-size: 3em;
  margin: 0;
}
.form__status {
  width: 80%;
  text-align: center;
  border-radius: 5px;
  padding: 2px;
}

.form__register-link,
.form__forgot {
  font-size: 1em;
  display: flex;
}

.form__forgot {
  text-decoration: none;
}

.form__body {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  width: 100%;
}

.form__input {
  width: 100%;
}
.form__button {
  width: 100%;
  border-radius: 5px;
}

.form-buttons {
  display: flex;
  gap: 0.5em;
}

@media (max-width: 1000px) {
  .form-wrapper {
    margin-top: 2rem;
    width: 100%;
  }
  .form__body {
    gap: 1em;
  }
}

@media (max-width: 600px) {
  .form {
    width: 80%;
  }
}
</style>
