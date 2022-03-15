import React from "react";
import { Text } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
const RootTitleField = ({ title }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "RootTitleField method starts here ",
      { title },
      "RootTitleField()",
      "RootTitleField.js"
    )
  );
  return (
    <Text category="h3" appearence="default">
      {title}
    </Text>
  );
};

export default RootTitleField;
