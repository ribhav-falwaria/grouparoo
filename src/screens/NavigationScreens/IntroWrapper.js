import React from "react";
import {
  TopNavigation,
  TopNavigationAction,
  useTheme,
  useStyleSheet,
  StyleService,
} from "@ui-kitten/components";
import styleConstants from "../styleConstants";
import SafeAreaLayout from "../../components/SafeAreaLayout.component";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const IntroWrapper = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "IntroWrapper method starts here",
      { props },
      "IntroWrapper()",
      "IntroWrapper.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  return (
    <SafeAreaLayout style={styles.safeArea} insets="top" level="2">
      {props.children}
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    ...styleConstants.introScreen,
  },
});

export default IntroWrapper;
