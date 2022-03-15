import DeviceInfo from "react-native-device-info";

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";
export class AppInfoService {
  static getVersion() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getVersion method starts here",
        undefined,
        "getVersion()",
        "app-info.service.js"
      )
    );
    return DeviceInfo.getVersion();
  }

  static getBuildNumber() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getBuildNumber method starts here",
        undefined,
        "getBuildNumber()",
        "app-info.service.js"
      )
    );
    return DeviceInfo.getBuildNumber();
  }
}
