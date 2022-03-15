import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

// type Inset = 'top' | 'bottom';

const SafeAreaLayout = ({ insets, ...props }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " SafeAreaLayout method starts here",
      { insets, ...props },
      "SafeAreaLayout()",
      "SafeAreaLayout.component.js"
    )
  );
  const insetsConfig = useSafeAreaInsets();
  return (
    <Layout
      {...props}
      style={[
        props.style,
        {
          paddingTop: insets === "top" ? insetsConfig.top : 0,
          paddingBottom: insets === "bottom" ? insetsConfig.bottom : 0,
        },
      ]}
    />
  );
};
export default SafeAreaLayout;
