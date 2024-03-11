import axios from "axios";
import md5 from "md5";

function generateXAuth(password) {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return md5(password + "_" + timestamp);
}

export const getProductsData = async (action, params) => {
  const password = import.meta.env.VITE_API_PASSWORD;
  const authHeader = generateXAuth(password);
  const url = "https://api.valantis.store:41000";
  const body = JSON.stringify({ action, params });

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authHeader,
      },
    });

    if (!response.status === 200) {
      throw new Error("Failed to fetch data");
    }

    return response.data.result;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(
        "Request was made, but server responded with status:",
        error.response.status
      );
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        "Request was made, but no response was received:",
        error.request
      );
    } else {
      // Something else happened while setting up the request
      console.error(
        "An error occurred while setting up the request:",
        error.message
      );
    }
  }
};
