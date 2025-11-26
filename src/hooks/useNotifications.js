import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function useNotifications(navigation) {
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
    notificationResponseListener();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert("Must use physical device for Push Notifications");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted for notifications");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("📨 Expo Push Token:", token);
    setExpoPushToken(token);
  }

  function notificationResponseListener() {
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      console.log("🔔 Notification tapped:", data);

      if (data?.screen) {
        navigation.navigate(data.screen, data.params || {});
      }
    });
  }

  return expoPushToken;
}
