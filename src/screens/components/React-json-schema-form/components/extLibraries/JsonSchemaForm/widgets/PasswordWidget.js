import TextWidget from "./TextWidget";
import React from "react";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const PasswordWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "PasswordWidget method starts here ",
      { props },
      "PasswordWidget()",
      "PasswordWidget.js"
    )
  );
  <TextWidget {...props} secureEntry />;
};

export default PasswordWidget;
