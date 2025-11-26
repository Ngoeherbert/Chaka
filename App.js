import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/auth/AuthProvider";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import ProductDetail from "./src/screens/ProductDetail";

import useNotifications from "./src/hooks/useNotifications";
import "./src/utils/notificationConfig";
import react from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = react.useRef(null);

  useNotifications({
    navigate: (...args) => navigationRef.current?.navigate(...args),
  });

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
          <Stack.Screen name="Detail" component={ProductDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
