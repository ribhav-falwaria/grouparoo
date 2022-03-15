/* eslint-disable camelcase */

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
import messaging from "@react-native-firebase/messaging";
import notifee, {
  EventType,
  AndroidBadgeIconType,
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";
import { AppStorage } from "./app-storage.service";
async function getAppFcmToken() {
  crashlytics().log(
    ErrorUtil.createLog(
      "getAppFcmToken method starts here",
      undefined,
      "getAppFcmToken()",
      "push.notifications.js"
    )
  );
  let fcmToken = await AppStorage.getFcmToken("default");
  if (fcmToken === "default") {
    await messaging().registerDeviceForRemoteMessages();
    fcmToken = await messaging().getToken();
    if (fcmToken) {
      // user has a device token
      await AppStorage.setFcmToken(fcmToken);
    }
  }
}

async function checkNotificationPermissions() {
  crashlytics().log(
    ErrorUtil.createLog(
      "checkNotificationPermissions method starts here",
      undefined,
      "checkNotificationPermissions()",
      "push.notifications.js"
    )
  );
  const enabled = await messaging().hasPermission();
  // If Premission granted proceed towards token fetch
  if (enabled) {
    getAppFcmToken();
  } else {
    // If permission hasn’t been granted to our app, request user in requestPermission method.
    return requestNotificationPermission();
  }
}
async function requestNotificationPermission() {
  crashlytics().log(
    ErrorUtil.createLog(
      "requestNotificationPermission method starts here",
      undefined,
      "requestNotificationPermission()",
      "push.notifications.js"
    )
  );
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}
const getFcmToken = async (defaultValue = "default") => {
  crashlytics().log(
    ErrorUtil.createLog(
      "getFcmToken method starts here",
      { defaultValue },
      "getFcmToken()",
      "push.notifications.js"
    )
  );
  return AppStorage.getFcmToken(defaultValue);
};

/*
{
  data: {
    notifee: JSON.stringify({
      body: 'This message was sent via FCM!',
      android: {
        channelId: 'default',
        actions: [
          {
            title: 'Mark as Read',
            pressAction: {
              id: 'read',
            },
          },
        ],
      },
    }),
  },
}
*/
const getPriority = (androidPriority) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "getPriority method starts here",
      { androidPriority },
      "getPriority()",
      "push.notifications.js"
    )
  );
  const priorityMap = {
    PRIORITY_HIGH: AndroidImportance.HIGH,
    PRIORITY_DEFAULT: AndroidImportance.DEFAULT,
    PRIORITY_LOW: AndroidImportance.LOW,
  };
  return priorityMap[androidPriority];
};
const visibilityMap = (aVisibility) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "visibilityMap method starts here",
      { aVisibility },
      "visibilityMap()",
      "push.notifications.js"
    )
  );
  const vmap = {
    PUBLIC: AndroidVisibility.PUBLIC,
    PRIVATE: AndroidVisibility.PRIVATE,
    SECRET: AndroidVisibility.SECRET,
  };
  return vmap[aVisibility];
};

const onMessageReceived = async (message) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "onMessageReceived method starts here",
      { message },
      "onMessageReceived()",
      "push.notifications.js"
    )
  );
  // Create a channel
  const { android } = message;
  const channel_id = android.notification.channel_id;
  const channelId = await notifee.createChannel({
    id: channel_id || "default",
    name: `${channel_id} name`,
    badge: android.notification.hasBadge || true,
    badgeIconType: AndroidBadgeIconType.SMALL,
    importance: getPriority(android.notification.notification_priority),
    visibility: visibilityMap(android.notification.visibility),
  });
  await notifee.displayNotification({
    title: android.notification.title,
    body: android.notification.title,
    android: {
      channelId,
      importance: getPriority(android.notification.notification_priority),
      color: android.notification.color,
      smallIcon: android.notificaton.icon,
      largeIcon: android.notification.largeIconPath,
      visibility: visibilityMap(android.notification.visibility),
      timestamp: Date.now(),
      showTimestamp: true,
      pressAction: { id: message.templateId },
    },
  });
};

notifee.onBackgroundEvent(async ({ type, detail, headless }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "onBackgroundEvent method starts here",
      { type, detail, headless },
      "onBackgroundEvent()",
      "push.notifications.js"
    )
  );
  const { notification, pressAction } = detail;

  if (type === EventType.DISMISSED) {
    console.log("DISMISSED");
  } else if (type === EventType.ACTION_PRESS) {
    console.log("PRESSED");
  }
  // Remove the notification
  await notifee.cancelNotification(notification.id);
});
export { checkNotificationPermissions, getFcmToken, onMessageReceived };
