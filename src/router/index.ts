import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import accountRoutes from "./account.routes";
import { useAuthStore } from "@/stores/AuthStore";
import PersonalProfile from "@/views/profile/PersonalProfileView.vue";
import BookDetail from "@/views/book-detail/BookDetail.vue";
import MainPageView from "@/views/MainPageView.vue";
import Admin from "@/views/admin/AdminView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainPageView,
    },
    {
      ...accountRoutes,
    },
    {
      path: "/profile",
      name: "profile",
      component: PersonalProfile,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
    },
    {
      path: "/book/:id",
      name: "book-detail",
      component: BookDetail,
    },
    { path: "/:pathMatch(.*)*", name: "not-found", redirect: "/" },
  ],
});

router.beforeEach(async (to) => {
  const publicPages = [
    "/account/login",
    "/account/register",
    "/account/forgot-password",
  ];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();
  if (authRequired && !authStore.user) {
    router.push("account/login");
  }
});

export default router;
