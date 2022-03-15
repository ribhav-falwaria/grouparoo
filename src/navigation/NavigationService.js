import * as React from "react";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

// NavigationContainer is referred here - Check NavigationStack
export const navigationRef = React.createRef();

function navigate(name, params) {
  crashlytics().log(
    ErrorUtil.createLog(
      "navigate method starts here",
      { name, params },
      "navigate()",
      "NavigationService.js"
    )
  );
  navigationRef.current?.navigate(name, params);
}

function goBack() {
  crashlytics().log(
    ErrorUtil.createLog(
      "goBack method starts here",
      { name, params },
      "goBack()",
      "NavigationService.js"
    )
  );
  navigationRef.current?.goBack();
}

export default {
  navigate,
  goBack,
};
