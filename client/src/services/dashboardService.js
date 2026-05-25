import axios from "axios";

const API = "http://localhost:5000/api/dashboard";


// GET DASHBOARD SUMMARY
export const getDashboardSummary = async (range = "daily") => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}?range=${range}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};