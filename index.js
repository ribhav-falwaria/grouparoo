/**
 * @format
 */
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import 'react-native-get-random-values'
import dayjs from 'dayjs'
import 'dayjs/locale/en-in'
import duration from 'dayjs/plugin/duration'
import { AppRegistry, Platform } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
dayjs.locale('en-in')
dayjs.extend(duration)
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App))

if (Platform.OS === 'web') {
  const rootTag =
    document.getElementById('root') || document.getElementById('main')
  AppRegistry.runApplication('KittenTricks', { rootTag })
}
