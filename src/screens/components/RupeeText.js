import React from "react";
import { Text } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const RupeeText = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "RupeeText method starts here",
      undefined,
      "RupeeText()",
      "RupeeText.js"
    )
  );
  return (
    <Text category="p1" status="basic">
      {"₹ "}
    </Text>
  );
};

export default RupeeText;
