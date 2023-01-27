<script setup lang="ts">
import { useAuthStore } from "@/stores/AuthStore";
const { logout, isAdmin, user } = useAuthStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"
        ><img class="logo" src="@/assets/icons/DAVA_BIG.D.png" alt="logo"
      /></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/"
              >Catalog
              <span class="visually-hidden">(current)</span>
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              @mouseover="(event: Event) => (event.target as HTMLElement).click()"
              >{{ user ? user.username : "USERNAME" }}</a
            >
            <div class="dropdown-menu dropdown-menu-end open">
              <router-link class="dropdown-item" to="/profile">
                My Profile</router-link
              >
              <router-link v-if="isAdmin" class="dropdown-item" to="/admin"
                >Admin</router-link
              >
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="logout">Sign Out</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.logo {
  width: 7rem;
}
</style>
