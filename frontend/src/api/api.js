import axios from "axios";

const api = axios.create({
  baseURL: "https://ngo-platform-1-5p3o.onrender.com",
});

export default api;
