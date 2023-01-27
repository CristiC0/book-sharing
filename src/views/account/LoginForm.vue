<script setup lang="ts">
import {
  validate,
  areInputsValid,
  validatorsUsername,
  validatorsPassword,
} from "@/helpers/useFormValidation";
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { RouterLink } from "vue-router";
const username = ref("");
const password = ref("");
const authStore = useAuthStore();
const serverError = ref(false);

const errors = reactive({
  username: false,
  password: false,
});

const validateInput = () => {
  const test = validate(errors);
  test(validatorsUsername, "username", username.value);
  test(validatorsPassword, "password", password.value);
};

const handleSubmit = async () => {
  validateInput();

  if (areInputsValid(errors)) {
    serverError.value = await authStore.login(username.value, password.value);
  } else {
    username.value = "";
    password.value = "";
  }
};
</script>

<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form__header">
        <p class="form__title">Login</p>
        <div class="form__register-link">
          <p class="text-muted">Don't have an account yet?</p>
          <router-link to="register"> Sign up </router-link>
        </div>
        <div
          class="alert alert-danger form__status"
          v-if="!areInputsValid(errors) || serverError"
        >
          Invalid username or password provided. Please double-check and try
          again.
        </div>
      </div>

      <div class="form__body">
        <div class="form-group form__input">
          <label class="col-form-label mt-4" for="username">Username</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': !!errors.username }"
            id="username"
            placeholder="Enter username"
            v-model="username"
          />
        </div>
        <div class="form-group form__input">
          <label class="col-form-label mt-4" for="password">Password</label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': !!errors.password }"
            id="password"
            placeholder="Enter password"
            v-model="password"
          />
        </div>
        <router-link to="forgot-password" class="form__forgot text-muted">
          Forgot your password?
        </router-link>

        <button class="btn btn-primary form__button" type="submit">
          Login
        </button>
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
  gap: 0.5em;
  width: 100%;
}

.form__input {
  width: 100%;
}
.form__button {
  width: 100%;
  border-radius: 5px;
}

@media (max-width: 1000px) {
  .form-wrapper {
    margin-top: 2rem;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .form {
    width: 80%;
  }
}
</style>
