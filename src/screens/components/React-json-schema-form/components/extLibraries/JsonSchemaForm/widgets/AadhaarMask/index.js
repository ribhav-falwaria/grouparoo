import React, { useContext } from "react";
import AadhaarMaskWidget from "./AadhaarMaskWidget";
import { LocalizationContext } from "../../../../../translation/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../../Errors/ErrorUtil";

const FRONT_SIDE = "front-side-aadhar-masked.jpeg";
const BACK_SIDE = "back-side-aadhar-masked.jpeg";
export const AadhaarMaskWidgetFront = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "AadhaarMaskWidgetFront method starts here ",
      { props },
      "AadhaarMaskWidgetFront()",
      "AadhaarMaskWidgetFront.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  return (
    <AadhaarMaskWidget
      {...props}
      fileName={FRONT_SIDE}
      selectText={translations["aadhar.uploadFrontSide"]}
    />
  );
};
export const AadhaarMaskWidgetBack = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "AadhaarMaskWidgetBack method starts here ",
      { props },
      "AadhaarMaskWidgetBack()",
      "AadhaarMaskWidgetBack.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  return (
    <AadhaarMaskWidget
      {...props}
      isBack
      fileName={BACK_SIDE}
      selectText={translations["aadhar.uploadBackSide"]}
    />
  );
};
