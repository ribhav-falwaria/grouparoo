import AsyncStorage from "@react-native-community/async-storage";
import isUndefined from "lodash.isundefined";
import isNull from "lodash.isnull";
const MAPPING_KEY = "mapping";
const THEME_KEY = "theme";
const FIRST_TIME = "isFirstTime";
const FCM_TOKEN = "fcmToken";
const SHOW_INTRO_SCREEN = "introScreen";
const PERMISSIONS_REQUESTED = "permissionsRequested";
const LOAN_APPLICATION_HELP = "loanApplicationHelp";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";
export class AppStorage {
  static async getMapping(fallback) {
    return AsyncStorage.getItem(MAPPING_KEY).then((mapping) => {
      return mapping || fallback;
    });
  }

  static async getLoanApplicationHelpShown() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getLoanApplicationHelpShown method starts here",
        undefined,
        "getLoanApplicationHelpShown()",
        "app-storage.service.js"
      )
    );
    const isShown = await AsyncStorage.getItem(LOAN_APPLICATION_HELP);
    if (isUndefined(isShown) || isNull(isShown)) {
      await this.setLoanApplicationHelpShown(false);
      return false;
    } else {
      return isShown === "true";
    }
  }

  static async setLoanApplicationHelpShown(pr) {
    crashlytics().log(
      ErrorUtil.createLog(
        "setLoanApplicationHelpShown method starts here",
        { pr },
        "setLoanApplicationHelpShown()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.setItem(LOAN_APPLICATION_HELP, pr.toString());
  }

  static async getPermissionsRequested(fallback) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getPermissionsRequested method starts here",
        { fallback },
        "getPermissionsRequested()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.getItem(PERMISSIONS_REQUESTED).then((pr) => {
      const value = pr || fallback;
      if (value === fallback) {
        return fallback;
      }
      return value === "true";
    });
  }

  static async togglePermissionRequested() {
    crashlytics().log(
      ErrorUtil.createLog(
        "togglePermissionRequested method starts here",
        undefined,
        "togglePermissionRequested()",
        "app-storage.service.js"
      )
    );
    const firstTime = await this.getPermissionsRequested("default");
    if (firstTime === "default") {
      await this.setPermissionsRequested(false);
    }
  }

  static async setPermissionsRequested(pr) {
    crashlytics().log(
      ErrorUtil.createLog(
        "setPermissionsRequested method starts here",
        { pr },
        "setPermissionsRequested()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.setItem(PERMISSIONS_REQUESTED, pr.toString());
  }

  static async getIsFirstTime(fallback) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getIsFirstTime method starts here",
        { fallback },
        "getIsFirstTime()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.getItem(FIRST_TIME).then((firstTime) => {
      const value = firstTime || fallback;
      if (value === fallback) {
        return fallback;
      }
      return value === "true";
    });
  }

  static async toggleFirstTime() {
    crashlytics().log(
      ErrorUtil.createLog(
        "toggleFirstTime method starts here",
        undefined,
        "toggleFirstTime()",
        "app-storage.service.js"
      )
    );
    const firstTime = await this.getIsFirstTime("default");
    if (firstTime === "default") {
      await this.setFirstTime(true);
    } else {
      await this.setFirstTime(false);
    }
  }

  static async setFirstTime(isFirstTime) {
    crashlytics().log(
      ErrorUtil.createLog(
        "setFirstTime method starts here",
        { isFirstTime },
        "setFirstTime()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.setItem(FIRST_TIME, isFirstTime.toString());
  }

  static async toggleIntroScreen() {
    crashlytics().log(
      ErrorUtil.createLog(
        "toggleIntroScreen method starts here",
        undefined,
        "toggleIntroScreen()",
        "app-storage.service.js"
      )
    );
    const showIntroScreen = await AsyncStorage.getItem(SHOW_INTRO_SCREEN);
    if (isNull(showIntroScreen) || isUndefined(showIntroScreen)) {
      await AsyncStorage.setItem(SHOW_INTRO_SCREEN, "true");
      return true;
    } else {
      if (showIntroScreen === "true") {
        await AsyncStorage.setItem(SHOW_INTRO_SCREEN, "false");
        return true;
      } else {
        return false;
      }
    }
  }

  static async getFcmToken(fallback) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getFcmToken method starts here",
        { fallback },
        "getFcmToken()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.getItem(FCM_TOKEN).then((fcmToken) => {
      return fcmToken || fallback;
    });
  }

  static async setFcmToken(fcmToken) {
    crashlytics().log(
      ErrorUtil.createLog(
        "setFcmToken method starts here",
        { fcmToken },
        "setFcmToken()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.setItem(FCM_TOKEN, fcmToken);
  }

  static async getTheme(fallback) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getTheme method starts here",
        { fallback },
        "getTheme()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.getItem(THEME_KEY).then((theme) => {
      return theme || fallback;
    });
  }

  static setMapping(mapping) {
    crashlytics().log(
      ErrorUtil.createLog(
        "setMapping method starts here",
        { mapping },
        "setMapping()",
        "app-storage.service.js"
      )
    );
    return AsyncStorage.setItem(MAPPING_KEY, mapping);
  }

  static setTheme(theme) {
    return AsyncStorage.setItem(THEME_KEY, theme);
  }
}
