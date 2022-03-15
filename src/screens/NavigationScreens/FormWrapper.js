import React from "react";
import { useStyleSheet, StyleService } from "@ui-kitten/components";
import styleConstants from "../styleConstants";
import SafeAreaLayout from "../../components/SafeAreaLayout.component";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const FormWrapper = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "FormWrapper method starts here",
      { props },
      "FormWrapper()",
      "FormWrapper.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  return (
    <SafeAreaLayout style={styles.safeArea} insets="top" level="1">
      {props.children}
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    ...styleConstants.authScreen,
  },
  safeAreaAlternate: {
    ...styleConstants.alternateScreen,
  },
});

export default FormWrapper;
