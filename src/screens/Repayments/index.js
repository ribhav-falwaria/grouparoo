import React from "react";
// For each loan list the repayments.
// Ability to repay outstanding of a loan / or all loans

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const Repayments = ({ navigation, route }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "Repayments method starts here",
      { navigation, route },
      "Repayments()",
      "Repayments.js"
    )
  );
  return null;
};

export default Repayments;
