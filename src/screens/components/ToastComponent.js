import React from "react";
import Toast from "react-native-toast-message";
import { Card, Text } from "@ui-kitten/components";
import { View, StyleSheet } from "react-native";
import { SuccessIcon, WarningIcon, InfoIcon } from "./ThemedIcons";

import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const errorToast = ({ props }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " errorToast method starts here",
      { props },
      "errorToast()",
      "ToastComponent.js"
    )
  );
  const { title, description } = props;
  return (
    <Card status="danger" style={styles.toastContainer}>
      <View style={styles.content}>
        <WarningIcon />
        <Text category="h6">{title}</Text>
      </View>
      <View>
        <Text category="p1">{description}</Text>
      </View>
    </Card>
  );
};
const successToast = ({ props }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " successToast method starts here",
      { props },
      "successToast()",
      "ToastComponent.js"
    )
  );
  const { title, description } = props;
  return (
    <Card status="success" style={styles.toastContainer}>
      <View style={styles.content}>
        <SuccessIcon />
        <Text category="h6">{title}</Text>
      </View>
      <View>
        <Text category="p1">{description}</Text>
      </View>
    </Card>
  );
};
const infoToast = ({ props }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " infoToast method starts here",
      { props },
      "infoToast()",
      "ToastComponent.js"
    )
  );
  const { title, description } = props;
  return (
    <Card status="info" style={styles.toastContainer}>
      <View style={styles.content}>
        <InfoIcon />
        <Text category="h6">{title}</Text>
      </View>
      <View>
        <Text category="p1">{description}</Text>
      </View>
    </Card>
  );
};
const genericToast = ({ props }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " genericToast method starts here",
      { props },
      "genericToast()",
      "ToastComponent.js"
    )
  );
  const { title, status, description, Icon } = props;
  return (
    <Card status={status} style={styles.toastContainer}>
      <View style={styles.content}>
        <Icon />
        <Text category="h6">{title}</Text>
      </View>
      <View>
        <Text category="p1">{description}</Text>
      </View>
    </Card>
  );
};
const toastConfig = {
  error: errorToast,
  success: successToast,
  info: infoToast,
  base: genericToast,
};
const styles = StyleSheet.create({
  toastContainer: {
    width: "95%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
});

const ToastComponent = () => <Toast position="botton" config={toastConfig} />;
export default ToastComponent;
