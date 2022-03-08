import React from "react";
import {
  Text,
  Button,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import { View } from "react-native";
import crashlytics from '@react-native-firebase/crashlytics';

const ErrorFallbackComponent = ({ error, resetError }) => {
  crashlytics().recordError(error);
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.container}>
      <Text category={"h1"}>Something happened!</Text>
      <Text>{error.toString()}</Text>
      <Button onPress={resetError} status={"primary"} title={"Try again"} />
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ErrorFallbackComponent;
