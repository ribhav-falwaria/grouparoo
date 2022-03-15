import React from "react";
import { Icon, useTheme } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../Errors/ErrorUtil";
const buildEvaIcon = (name, fill, width, height) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " buildEvaIcon method starts here",
      { name, fill, width, height },
      "buildEvaIcon()",
      "IconUtil.js"
    )
  );
  const theme = useTheme();
  const fillColor = fill ? theme[fill] : theme["color-warning-300"];
  return (
    <Icon
      name={name}
      style={{ marginRight: 4 }}
      fill={fillColor}
      width={width || 20}
      height={height || 20}
    />
  );
};
const IconUtil = {
  UploadIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " UploadIcon method starts here",
        { props },
        "UploadIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("upload-outline", "color-primary-default");
  },
  SyncIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " SyncIcon method starts here",
        { props },
        "SyncIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("sync", "color-info-default");
  },
  AttachmentIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " AttachmentIcon method starts here",
        { props },
        "AttachmentIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("attach-2-outline");
  },
  CameraIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " CameraIcon method starts here",
        { props },
        "CameraIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("camera-outline");
  },
  CancelIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " CancelIcon method starts here",
        { props },
        "CancelIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("close", "color-danger-default");
  },
  CancelButtonIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " CancelButtonIcon method starts here",
        { props },
        "CancelButtonIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("close-circle", "color-danger-default", 24, 24);
  },
  CloseCircle: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " CloseCircle method starts here",
        { props },
        "CloseCircle()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("alert-circle-outline");
  },
  NextIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " NextIcon method starts here",
        { props },
        "NextIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("chevron-right-outline", "color-basic-100", 24, 24);
  },
  BackIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " BackIcon method starts here",
        { props },
        "BackIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("chevron-left-outline", "text-basic-color", 24, 24);
  },
  ErrorIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " ErrorIcon method starts here",
        { props },
        "ErrorIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("close-outline", "color-danger-default", 24, 24);
  },
  CheckIcon: (props) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " CheckIcon method starts here",
        { props },
        "CheckIcon()",
        "IconUtil.js"
      )
    );
    return buildEvaIcon("checkmark-outline", "color-success-default", 24, 24);
  },
};

export default IconUtil;
