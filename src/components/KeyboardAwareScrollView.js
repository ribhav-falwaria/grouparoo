import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

/**
 * https://github.com/APSL/react-native-keyboard-aware-scroll-view
 */
const KeyboardAvoidingView = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " KeyboardAvoidingView method starts here",
      { props },
      "KeyboardAvoidingView()",
      "KeyboardAwareScrollView.js"
    )
  );
  const defaultProps = {
    style: { flex: 1 },
    contentContainerStyle: { flexGrow: 1 },
    bounces: false,
    bouncesZoom: false,
    alwaysBounceVertical: false,
    alwaysBounceHorizontal: false,
  };

  return React.createElement(KeyboardAwareScrollView, {
    enableOnAndroid: true,
    ...defaultProps,
    ...props,
  });
};
export default KeyboardAvoidingView;
