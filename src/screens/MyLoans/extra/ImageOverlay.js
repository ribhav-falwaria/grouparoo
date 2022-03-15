import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../Errors/ErrorUtil";

const DEFAULT_OVERLAY_COLOR = "rgba(0, 0, 0, 0.45)";

export const ImageOverlay = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "ImageOverlay method starts here",
      { props },
      "ImageOverlay()",
      "ImageOverlay.js"
    )
  );
  const { style, children, ...imageBackgroundProps } = props;
  const { overlayColor, ...imageBackgroundStyle } = StyleSheet.flatten(style);

  return (
    <ImageBackground {...imageBackgroundProps} style={imageBackgroundStyle}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: overlayColor || DEFAULT_OVERLAY_COLOR },
        ]}
      />
      {children}
    </ImageBackground>
  );
};
