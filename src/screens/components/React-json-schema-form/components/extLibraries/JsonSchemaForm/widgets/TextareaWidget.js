import TextWidget from "./TextWidget";
import React from "react";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const TextareaWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "TextareaWidget method starts here ",
      { props },
      "TextareaWidget()",
      "TextareaWidget.js"
    )
  );
  return <TextWidget {...props} multiline />;
};

export default TextareaWidget;
