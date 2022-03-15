import React from "react";
import { View } from "react-native";
import {
  Button,
  Spinner,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const SpinnerButton = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "SpinnerButton method starts here",
      { props },
      "SpinnerButton()",
      "SpinnerButton.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  const buttonIcon = (item) => {
    if (props.Icon && !props.loading) {
      return <props.Icon {...item} />;
    } else {
      return null;
    }
  };
  return (
    <Button
      style={props.style}
      appearance={props.appearance || "filled"}
      disabled={props.disabled}
      status={props.status || "primary"}
      size={props.size || "medium"}
      accessoryRight={buttonIcon}
      onPress={props.onPress}
    >
      {props.loading && (
        <View style={[styles.indicator, props.style]}>
          {props.loading && (
            <Spinner
              size={props.size || "tiny"}
              status={props.status || "basic"}
            />
          )}
        </View>
      )}
      {!props.loading && props.children}
    </Button>
  );
};
const themedStyles = StyleService.create({
  indicator: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
  },
});
export default SpinnerButton;
