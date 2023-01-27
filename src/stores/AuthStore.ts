import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "@/router";
import { serverAddress } from "@/config.json";

const savedUserState = JSON.parse(`${localStorage.getItem("user")}`);

type User = {
  token: string;
  username: string;
  role: string;
  userId: string;
};
export const useAuthStore = defineStore("AuthStore", () => {
  const user = ref<User | null>(savedUserState);
  async function register(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    email: string
  ) {
    try {
      const response = await fetch(`${serverAddress}/api/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          userName,
          password,
          email,
        }),
      });

      if (response.ok) {
        setTimeout(() => router.push("/account/login"), 1000);
        return "";
      }

      const error = await response.text();

      if (error.includes("is already taken"))
        return "Your registration failed because such an username/email exists in the system.";

      if (response.status >= 400)
        return "Your registration failed due to an internal server error. Please try again later.";

      return "";
    } catch (error) {
      console.error(error);
      return "Your registration failed due to an internal server error. Please try again later.";
    }
  }
  async function login(username: string, password: string) {
    try {
      const response = await fetch(`${serverAddress}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) return true;

      const token = await response.json();

      const jwtData = token.value.split(".")[1];
      const decodedJwtData = JSON.parse(atob(jwtData));

      user.value = {
        token: token.value,
        username:
          decodedJwtData[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ],
        role: decodedJwtData[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        userId: decodedJwtData.UserId,
      };

      localStorage.setItem("user", JSON.stringify(user.value));
      router.push("/");
    } catch (error) {
      console.error(error);
      return true;
    }
    return false;
  }
  function logout() {
    user.value = null;
    localStorage.removeItem("user");
    router.push("/account/login");
  }

  const isAdmin = computed(() => {
    const role = user.value?.role;
    return role === "SuperAdministrator" || role === "Administrator";
  });

  return { user, register, login, logout, isAdmin };
});
