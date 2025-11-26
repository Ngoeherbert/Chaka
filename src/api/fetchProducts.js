// src/api/fetchProducts.js

import { products as localProducts } from "../data/products";

// Example Laravel API URL
const API_URL = "https://your-laravel-api.com/api/products";

export const fetchProducts = async (onSuccess, onError) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    onSuccess(data); // Call the callback with API data
  } catch (error) {
    console.log("API fetch failed, using local data:", error.message);
    onError(localProducts); // Call the callback with local fallback
  }
};
