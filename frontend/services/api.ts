import axios from "axios";

const deployEnv = process.env.DEPLOY || "local";
const Endpoint_Gateway = deployEnv === "prod" ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:8080";
const Endpoint_Gateway_ws = deployEnv === "prod" ? process.env.NEXT_PUBLIC_WS_URL : "ws://localhost:8080";

const api = axios.create({
  baseURL: Endpoint_Gateway, // URL for backend
  withCredentials: true, // cookie
});

export {
  api,
  Endpoint_Gateway,
  Endpoint_Gateway_ws,
}
