import axios from "axios";

const prod = process.env.NODE_ENV === "production" || true;
const Endpoint_Gateway = prod
  ? "https://tygame.up.railway.app"
  : "http://localhost:8080";
const Endpoint_Party_ws = prod
  ? "wss://party-service-tygame.up.railway.app"
  : "ws://localhost:5005";

const api = axios.create({
  baseURL: Endpoint_Gateway, // URL for backend
  withCredentials: true, // cookie
});

export { api, Endpoint_Gateway, Endpoint_Party_ws };
