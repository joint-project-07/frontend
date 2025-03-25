import axios from "axios";

const API_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://223.130.151.137";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
