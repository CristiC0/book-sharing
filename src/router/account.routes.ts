export default {
  path: "/account",
  component: () => import("@/views/account/AcountLayout.vue"),
  children: [
    { path: "", redirect: "login" },
    {
      path: "register",
      component: () => import("@/views/account/RegisterForm.vue"),
    },
    {
      path: "login",
      component: () => import("@/views/account/LoginForm.vue"),
    },
    {
      path: "forgot-password",
      component: () => import("@/views/account/ForgotPassword.vue"),
    },
  ],
};
