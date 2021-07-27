import { NativeModules } from 'react-native'

export class AppReloadService {
  static reload () {
    NativeModules.DevMenu.reload()
  }
}
