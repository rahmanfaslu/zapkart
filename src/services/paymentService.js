import api from "../utils/axiosInstance";

export const createOrder = (amount) =>
  api.post("/api/payment/create-order", { amount });

export const verifyPayment = (data) =>
  api.post("/api/payment/verify", data);
