import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchProposals = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/proposals`);
    return data;
  } catch (err) {
    console.error("Failed to fetch proposals:", err);
    return [];
  }
};

export const submitProposal = async (title, description) => {
  try {
    const { data } = await axios.post(`${API_BASE}/proposals`, {
      title,
      description,
    });
    return data;
  } catch (err) {
    console.error("Failed to submit proposal:", err);
    return null;
  }
};
