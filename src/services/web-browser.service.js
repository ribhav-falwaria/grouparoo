import { Linking, Platform } from "react-native";
import SafariView from "react-native-safari-view";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

export class WebBrowserService {
  static openBrowserAsync(url) {
    crashlytics().log(
      ErrorUtil.createLog(
        "openBrowserAsync method starts here",
        { url },
        "openBrowserAsync()",
        "web-browser.service.js"
      )
    );
    if (Platform.OS === "ios") {
      return WebBrowserService.openInAppUrl(url).catch(() =>
        WebBrowserService.openUrl(url)
      );
    } else {
      return WebBrowserService.openUrl(url);
    }
  }

  static openInAppUrl(url) {
    crashlytics().log(
      ErrorUtil.createLog(
        "openInAppUrl method starts here",
        { url },
        "openInAppUrl()",
        "web-browser.service.js"
      )
    );
    return SafariView.isAvailable().then(() => SafariView.show({ url }));
  }

  static openUrl(url) {
    crashlytics().log(
      ErrorUtil.createLog(
        "openUrl method starts here",
        { url },
        "openUrl()",
        "web-browser.service.js"
      )
    );
    return Linking.openURL(url);
  }
}
