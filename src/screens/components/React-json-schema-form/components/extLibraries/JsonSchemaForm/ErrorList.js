import React, { useContext } from "react";
import { StyleService, Text, useStyleSheet } from "@ui-kitten/components";

import { View } from "react-native";
import { LocalizationContext } from "../../../translation/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../Errors/ErrorUtil";
const ErrorList = ({ errors }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "ErrorList method starts here",
      { errors },
      "Errorlist()",
      "Errorlist.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title} status="warning" category="s1">
        {translations.formatString(translations["form.fixErrors"], {
          errorCount: errors.length,
        })}
      </Text>
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
  },
  error: {
    color: "black",
  },
});

export default ErrorList;
