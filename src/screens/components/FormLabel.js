import React from "react";
import { Text } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const FormLabel = ({ content }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "FormLabel method starts here",
      { content },
      "FormLabel()",
      "FormLabel.js"
    )
  );
  return (
    <Text appearance="hint" category="p1">
      {content}
    </Text>
  );
};
export default FormLabel;
