import { useAuthStore } from "@/stores/AuthStore";
import { serverAddress } from "@/config.json";

const createUrl = (url: string) => `${serverAddress}${url}`;

const authorizationHeader = () => {
  const token = useAuthStore().user?.token ?? "";
  return { Authorization: `Bearer  ${token}` };
};

const get = (url: string) => fetch(createUrl(url));

const getAuthorized = (url: string) =>
  fetch(createUrl(url), {
    headers: {
      ...authorizationHeader(),
    },
  });

const post = (url: string, body: object) =>
  fetch(createUrl(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

const postAuthorized = (url: string, body?: object) =>
  fetch(createUrl(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authorizationHeader(),
    },
    body: JSON.stringify(body),
  });

const put = (url: string, body?: object) =>
  fetch(createUrl(url), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authorizationHeader(),
    },
    body: JSON.stringify(body),
  });

const postAuthorizedFormData = (
  url: string,
  body: { [key: string]: string | Blob }
) => {
  const formData = new FormData();
  Object.keys(body).forEach((key) => formData.append(key, body[key]));
  return fetch(createUrl(url), {
    method: "POST",
    headers: {
      ...authorizationHeader(),
    },
    body: formData,
  });
};

const deleteAuthorized = (url: string, body?: object) =>
  fetch(createUrl(url), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authorizationHeader(),
    },
    body: JSON.stringify(body),
  });

export const useFetch = {
  get,
  getAuthorized,
  post,
  postAuthorized,
  postAuthorizedFormData,
  put,
  deleteAuthorized,
};
