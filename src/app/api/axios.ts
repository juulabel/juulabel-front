import axios from "axios";
import nookies from "nookies";
import { v4 as uuidv4 } from "uuid";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JUULABEL_API_URL,
  timeout: 20000,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    // 브라우저 환경에서만 쿠키 읽기
    if (typeof window !== "undefined") {
      const cookies = nookies.get();
      const csrftoken = cookies.csrfToken;
      const deviceId = localStorage.getItem("device-id") || uuidv4();
      if (!localStorage.getItem("device-id")) {
        localStorage.setItem("device-id", deviceId);
      }

      if (csrftoken) {
        config.headers["X-CSRF-TOKEN"] = csrftoken;
        config.headers["Device-Id"] = deviceId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const formInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JUULABEL_API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});
