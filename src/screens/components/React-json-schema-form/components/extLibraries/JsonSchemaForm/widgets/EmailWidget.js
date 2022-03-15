import TextWidget from "./TextWidget";
import React from "react";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const EmailWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "EmailWidget method starts here ",
      { props },
      "EmailWidget()",
      "EmailWidget.js"
    )
  );
  <TextWidget {...props} textContentType="emailAddress" />;
};

export default EmailWidget;
