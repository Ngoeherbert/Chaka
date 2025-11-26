import AsyncStorage from "@react-native-async-storage/async-storage";

const PRODUCTS_KEY = "@products";

export const saveItems = async (products = []) => {
  try {
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Error saving items", e);
  }
};

export const loadItems = async () => {
  try {
    const json = await AsyncStorage.getItem(PRODUCTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error loading items", e);
    return [];
  }
};
