import AsyncStorage from '@react-native-community/async-storage'
import isUndefined from 'lodash.isundefined'
import isNull from 'lodash.isnull'
const MAPPING_KEY = 'mapping'
const THEME_KEY = 'theme'
const FIRST_TIME = 'isFirstTime'
const FCM_TOKEN = 'fcmToken'
const SHOW_INTRO_SCREEN = 'introScreen'
const PERMISSIONS_REQUESTED = 'permissionsRequested'
const LOAN_APPLICATION_HELP = 'loanApplicationHelp'
const LOAN_AGREEMENT_HELP = 'loanAgreementHelp'
export class AppStorage {
  static async getMapping (fallback) {
    return AsyncStorage.getItem(MAPPING_KEY).then(mapping => {
      return mapping || fallback
    })
  }

  static async getLoanAgreementHelpShown () {
    const isShown = await AsyncStorage.getItem(LOAN_AGREEMENT_HELP)
    if (isUndefined(isShown) || isNull(isShown)) {
      await this.setLoanApplicationHelpShown(false)
      return false
    } else {
      return isShown === 'true'
    }
  }

  static async setLoanAgreementnHelpShown (pr) {
    return AsyncStorage.setItem(LOAN_AGREEMENT_HELP, pr.toString())
  }

  static async getLoanApplicationHelpShown () {
    const isShown = await AsyncStorage.getItem(LOAN_APPLICATION_HELP)
    if (isUndefined(isShown) || isNull(isShown)) {
      await this.setLoanApplicationHelpShown(false)
      return false
    } else {
      return isShown === 'true'
    }
  }

  static async setLoanApplicationHelpShown (pr) {
    return AsyncStorage.setItem(LOAN_APPLICATION_HELP, pr.toString())
  }

  static async getPermissionsRequested (fallback) {
    return AsyncStorage.getItem(PERMISSIONS_REQUESTED).then(pr => {
      const value = pr || fallback
      if (value === fallback) {
        return fallback
      }
      return value === 'true'
    })
  }

  static async togglePermissionRequested () {
    const firstTime = await this.getPermissionsRequested('default')
    if (firstTime === 'default') {
      await this.setPermissionsRequested(false)
    }
  }

  static async setPermissionsRequested (pr) {
    return AsyncStorage.setItem(PERMISSIONS_REQUESTED, pr.toString())
  }

  static async getIsFirstTime (fallback) {
    return AsyncStorage.getItem(FIRST_TIME).then(firstTime => {
      const value = firstTime || fallback
      if (value === fallback) {
        return fallback
      }
      return value === 'true'
    })
  }

  static async toggleFirstTime () {
    const firstTime = await this.getIsFirstTime('default')
    if (firstTime === 'default') {
      await this.setFirstTime(true)
    } else {
      await this.setFirstTime(false)
    }
  }

  static async setFirstTime (isFirstTime) {
    return AsyncStorage.setItem(FIRST_TIME, isFirstTime.toString())
  }

  static async toggleIntroScreen () {
    const showIntroScreen = await AsyncStorage.getItem(SHOW_INTRO_SCREEN)
    if (isNull(showIntroScreen) || isUndefined(showIntroScreen)) {
      await AsyncStorage.setItem(SHOW_INTRO_SCREEN, 'true')
      return true
    } else {
      if (showIntroScreen === 'true') {
        await AsyncStorage.setItem(SHOW_INTRO_SCREEN, 'false')
        return true
      } else {
        return false
      }
    }
  }

  static async getFcmToken (fallback) {
    return AsyncStorage.getItem(FCM_TOKEN).then(fcmToken => {
      return fcmToken || fallback
    })
  }

  static async setFcmToken (fcmToken) {
    return AsyncStorage.setItem(FCM_TOKEN, fcmToken)
  }

  static async getTheme (fallback) {
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
