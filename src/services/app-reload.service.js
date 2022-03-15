import { NativeModules } from "react-native";

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";

export class AppReloadService {
  static reload() {
    crashlytics().log(
      ErrorUtil.createLog(
        "reload method starts here",
        undefined,
        "reload()",
        "app-reload.service.js"
      )
    );
    NativeModules.DevMenu.reload();
  }
}
