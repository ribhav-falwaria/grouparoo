import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { OnboardNavigationScreens } from "../screens/NavigationScreens";
import { LocalizationContext } from "../components/Translation";
import LoadingSpinner from "../screens/components/LoadingSpinner";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

// When logging out, a pop animation feels intuitive
// You can remove this if you want the default 'push' animation

const OnboardNavigator = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "OnboardNavigator method starts here",
      { props },
      "OnboardNavigator()",
      "Onboard.Navigation.js"
    )
  );
  if (props.loading) {
    return <LoadingSpinner />;
  }
  const { Component, title } = OnboardNavigationScreens(props.screenProps);
  return <Component {...props} title={title} />;
};

export default OnboardNavigator;
