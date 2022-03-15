import React, { useState } from "react";
import { Button } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const ButtonWithDisable = ({ onPress, isDisabled, ...rest }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "ButtonWithDisable method starts here",
      { onPress, isDisabled, ...rest },
      "ButtonWithDisable()",
      "ButtonWithDisable.js"
    )
  );
  const [disabled, setDisabled] = useState(isDisabled || false);
  const onThisPress = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onThisPress method starts here",
        undefined,
        "onThisPress()",
        "ButtonWithDisable.js"
      )
    );
    setDisabled();
    onPress();
  };
  return (
    <Button {...rest} onPress={onThisPress} disabled={disabled}>
      {rest.children}
    </Button>
  );
};

export default ButtonWithDisable;
