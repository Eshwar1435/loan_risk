import axios from "axios";

const API_URL = "http://127.0.0.1:8000/predict";

export const predictRisk = async (payload) => {
  const response = await axios.post(API_URL, payload);
  return response.data;
};
