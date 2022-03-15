import React from "react";

/**
 * https://github.com/APSL/react-native-keyboard-aware-scroll-view
 */

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../Errors/ErrorUtil";
export const KeyboardAvoidingView = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "KeyboardAvoidingView method starts here",
      { props },
      "KeyboardAvoidingView()",
      "3rd-party.js"
    )
  );
  const lib = require("react-native-keyboard-aware-scroll-view");

  const defaultProps = {
    style: { flex: 1 },
    contentContainerStyle: { flexGrow: 1 },
    bounces: false,
    bouncesZoom: false,
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false,
  };

  return React.createElement(lib.KeyboardAwareScrollView, {
    enableOnAndroid: true,
    ...defaultProps,
    ...props,
  });
};
