/* eslint-disable camelcase */

import messaging from '@react-native-firebase/messaging'
import notifee, { EventType, AndroidBadgeIconType, AndroidImportance, AndroidVisibility } from '@notifee/react-native'
import { AppStorage } from './app-storage.service'
async function getAppFcmToken () {
  let fcmToken = await AppStorage.getFcmToken('default')
  if (fcmToken === 'default') {
    await messaging().registerDeviceForRemoteMessages()
    fcmToken = await messaging().getToken()
    if (fcmToken) {
      // user has a device token
      await AppStorage.setFcmToken(fcmToken)
    }
  }
}

async function checkNotificationPermissions () {
  const enabled = await messaging().hasPermission()
  // If Premission granted proceed towards token fetch
  if (enabled) {
    getAppFcmToken()
  } else {
    // If permission hasn’t been granted to our app, request user in requestPermission method.
    return requestNotificationPermission()
  }
}
async function requestNotificationPermission () {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  return enabled
}
const getFcmToken = async (defaultValue = 'default') => {
  return AppStorage.getFcmToken(defaultValue)
}

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
  const priorityMap = {
    PRIORITY_HIGH: AndroidImportance.HIGH,
    PRIORITY_DEFAULT: AndroidImportance.DEFAULT,
    PRIORITY_LOW: AndroidImportance.LOW
  }
  return priorityMap[androidPriority]
}
const visibilityMap = (aVisibility) => {
  const vmap = {
    PUBLIC: AndroidVisibility.PUBLIC,
    PRIVATE: AndroidVisibility.PRIVATE,
    SECRET: AndroidVisibility.SECRET
  }
  return vmap[aVisibility]
}

const onMessageReceived = async (message) => {
  // Create a channel
  const { android } = message
  const channel_id = android.notification.channel_id
  const channelId = await notifee.createChannel({
    id: channel_id || 'default',
    name: `${channel_id} name`,
    badge: android.notification.hasBadge || true,
    badgeIconType: AndroidBadgeIconType.SMALL,
    importance: getPriority(android.notification.notification_priority),
    visibility: visibilityMap(android.notification.visibility)
  })
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
      pressAction: { id: message.templateId }
    }
  })
}

notifee.onBackgroundEvent(async ({ type, detail, headless }) => {
  const { notification, pressAction } = detail

  if (type === EventType.DISMISSED) {
    console.log('DISMISSED')
  } else if (type === EventType.ACTION_PRESS) {
    console.log('PRESSED')
  }
  // Remove the notification
  await notifee.cancelNotification(notification.id)
})
export {
  checkNotificationPermissions,
  getFcmToken,
  onMessageReceived
}
