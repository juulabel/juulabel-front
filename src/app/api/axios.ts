import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JUULABEL_API_URL,
  timeout: 3000,
});

export const formInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JUULABEL_API_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
