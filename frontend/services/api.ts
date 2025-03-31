import axios from "axios";

const prod = process.env.NODE_ENV === 'production'
const Endpoint_Gateway = prod ? "https://tygame.up.railway.app" : "http://localhost:8080";
const Endpoint_Gateway_ws = prod ? "ws://tygame.up.railway.app" : "ws://localhost:8080";


const api = axios.create({
  baseURL: Endpoint_Gateway, // URL for backend
  withCredentials: true, // cookie
});

export {
  api,
  Endpoint_Gateway,
  Endpoint_Gateway_ws,
}
