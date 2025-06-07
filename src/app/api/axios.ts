import axios from "axios";
import nookies from "nookies";

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

      if (csrftoken) {
        config.headers["X-CSRF-TOKEN"] = csrftoken;
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
