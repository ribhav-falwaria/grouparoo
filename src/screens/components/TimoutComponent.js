import React, { useState, useContext } from "react";
import { useCountDown } from "ahooks";
import { Text } from "@ui-kitten/components";
import { LocalizationContext } from "../../components/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const TimeoutComponent = ({ validWindow, startTime }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "TimeoutComponent method starts here",
      { validWindow, startTime },
      "TimeoutComponent()",
      "TimeoutComponent.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const [isTimeout, setTimeout] = useState(false);
  const [_, formattedRes] = useCountDown({
    targetDate: startTime + validWindow,
    onEnd: () => setTimeout(true),
  });
  return (
    <Text category="c1" status="primary">
      {isTimeout === false &&
        translations.formatString(translations["otp.otpTimer"], {
          minutes: formattedRes.minutes,
          seconds: formattedRes.seconds,
        })}
      {isTimeout === true && translations["otp.otpTimeout"]}
    </Text>
  );
};
export default TimeoutComponent;
