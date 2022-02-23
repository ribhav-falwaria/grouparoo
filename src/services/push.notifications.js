import messaging from '@react-native-firebase/messaging'
import { AppStorage } from './app-storage.service'
async function getAppFcmToken () {
  let fcmToken = await AppStorage.getFcmToken('default')
  if (fcmToken === 'default') {
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
const createNotificationListeners = async () => {
  // This listener triggered when notification has been received in foreground
  this.notificationListener = messaging().notifications().onNotification((notification) => {
    const { title, body } = notification
    this.displayNotification(title, body)
  })

  // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
  this.notificationOpenedListener = messaging().notifications().onNotificationOpened((notificationOpen) => {
    const { title, body } = notificationOpen.notification
    this.displayNotification(title, body)
  })

  // This listener triggered when app is closed and we click,tapped and opened notification 
  const notificationOpen = await messaging().notifications().getInitialNotification()
  if (notificationOpen) {
    const { title, body } = notificationOpen.notification
    this.displayNotification(title, body)
  }
}

export {
  checkNotificationPermissions,
  getFcmToken
}
