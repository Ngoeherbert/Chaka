import AsyncStorage from "@react-native-async-storage/async-storage";

// Simulate Laravel API delay
const wait = (ms) => new Promise((res) => setTimeout(res, ms));


// Register user
export const registerUser = async (email, password) => {
  await wait(500);

  const users = JSON.parse(await AsyncStorage.getItem("users")) || [];

  const exists = users.find((u) => u.email === email);

  if (exists) {
    throw new Error("User already exists");
  }

  const newUser = { id: Date.now(), email, password };
  users.push(newUser);

  await AsyncStorage.setItem("users", JSON.stringify(users));

  return {
    message: "User registered successfully",
    user: newUser,
    token: "fake_laravel_token_" + newUser.id,
  };
};


// Login user
export const loginUser = async (email, password) => {
  await wait(500);

  const users = JSON.parse(await AsyncStorage.getItem("users")) || [];

  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    throw new Error("Invalid email or password");
  }

  return {
    message: "Login successful",
    user: found,
    token: "fake_laravel_token_" + found.id,
  };
};
