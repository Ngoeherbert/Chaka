import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../screens/Dashboard";
import { View, Text } from "react-native";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: "#fff", width: 250 },
        gestureEnabled: true,
      }}
    >
      <Drawer.Screen
        name="DashboardMain"
        component={Dashboard}
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen
        name="Profile"
        component={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Profile Screen</Text>
          </View>
        )}
      />
      <Drawer.Screen
        name="Orders"
        component={() => (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Orders Screen</Text>
          </View>
        )}
      />
    </Drawer.Navigator>
  );
}
