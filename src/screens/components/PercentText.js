import React from "react";
import { Text } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const PercentText = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "PercentText method starts here",
      undefined,
      "PercentText()",
      "PercentText.js"
    )
  );
  return (
    <Text category="p1" status="basic">
      {" %"}
    </Text>
  );
};

export default PercentText;
