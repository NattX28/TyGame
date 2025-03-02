import axios from "axios";
// instance of axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // URL for backend
  withCredentials: true, // cookie
});

export default api;
