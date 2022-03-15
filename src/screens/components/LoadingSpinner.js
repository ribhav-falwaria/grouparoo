import React from "react";
import { StyleSheet, View } from "react-native";
import { Spinner } from "@ui-kitten/components";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const LoadingSpinner = ({ visible }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "LoadingSpinner method starts here",
      { visible },
      "LoadingSpinner()",
      "LoadingSpinner.js"
    )
  );
  if (visible === false) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.controlContainer}>
        <Spinner status="control" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  controlContainer: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#3366FF",
  },
});

export default LoadingSpinner;
