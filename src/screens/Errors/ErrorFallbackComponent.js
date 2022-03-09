import React, { useContext } from "react";
import {
  Text,
  Button,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import { View } from "react-native";
import crashlytics from '@react-native-firebase/crashlytics';
import { LocalizationContext } from "../../components/Translation";

const ErrorFallbackComponent = ({ error, resetError }) => {
  const { translations } = useContext(LocalizationContext)
  crashlytics().recordError(error);
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.container}>
      <Text category={"h1"}>{translations["error.tryagain"]}</Text>
      {/* <Text>{error.toString()}</Text> */}
      <Button onPress={resetError} status={"primary"}>{translations["error.tryagain"]}</Button>
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
