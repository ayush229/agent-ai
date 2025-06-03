import axios from "axios";
import { getAuthHeader } from "../auth";

const BASE_URL = "https://web-scraper-api-production-ec96.up.railway.app";

// 1. Get All Agents
export const getAgents = async () => {
  const res = await axios.get(`${BASE_URL}/agents`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return res.data;
};

// 2. Create (Scrape and Store) Agent
export const createAgent = async (agent_name, url) => {
  const res = await axios.post(
    `${BASE_URL}/scrape_and_store`,
    { agent_name, url },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

// 3. Ask Agent
export const askAgent = async (unique_code, user_query) => {
  const res = await axios.post(
    `${BASE_URL}/ask_stored`,
    { unique_code, user_query },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

// 4. Update Agent
export const updateAgent = async (unique_code, url) => {
  const res = await axios.put(
    `${BASE_URL}/agents/${unique_code}`,
    { url },
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

// 5. Delete Agent
export const deleteAgent = async (unique_code) => {
  const res = await axios.delete(`${BASE_URL}/agents/${unique_code}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return res.data;
};
