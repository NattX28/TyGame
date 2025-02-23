import axios from "axios";
// instance of axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080", // URL backend
  withCredentials: true, // cookie
});

export default api;
