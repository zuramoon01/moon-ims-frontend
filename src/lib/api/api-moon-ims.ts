import axios from "axios";
import Cookies from "js-cookie";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export const apiMoonIMS = axios.create({
  baseURL: PUBLIC_BACKEND_URL,
  withCredentials: true,
});

apiMoonIMS.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
