import AsyncStorage from '@react-native-community/async-storage'
const MAPPING_KEY = 'mapping'
const THEME_KEY = 'theme'
const CLIENT_JWT = 'clientJwt'

export class AppStorage {
  static getMapping (fallback) {
    return AsyncStorage.getItem(MAPPING_KEY).then(mapping => {
      return mapping || fallback
    })
  }
  static getClientJwt(fallback) {
    return AsyncStorage.getItem(CLIENT_JWT).then(jwtToken => {
      return jwtToken || fallback
    })
  }
  static setClientJwt(jwtToken) {
    return AsyncStorage.setItem(CLIENT_JWT, jwtToken)
  }
  static getTheme (fallback) {
    return AsyncStorage.getItem(THEME_KEY).then(theme => {
      return theme || fallback
    })
  }

  static setMapping (mapping) {
    return AsyncStorage.setItem(MAPPING_KEY, mapping)
  }

  static setTheme (theme) {
    return AsyncStorage.setItem(THEME_KEY, theme)
  }
}
