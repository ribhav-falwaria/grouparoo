import TextWidget from "./TextWidget";
import React from "react";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const URLWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "URLWidget method starts here ",
      { props },
      "URLWidget()",
      "URLWidget.js"
    )
  );
  <TextWidget {...props} textContentType="URL" />;
};

export default URLWidget;
