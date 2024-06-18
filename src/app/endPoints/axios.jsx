import axios from "axios";

const axiosBase = axios.create({
  baseURL: "https://tv-networks-server.onrender.com/" || "http://localhost:5000/",
});
export default axiosBase;
