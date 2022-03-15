import React, { useContext } from "react";
import { View } from "react-native";
import {
  Text,
  Button,
  StyleService,
  useStyleSheet,
} from "@ui-kitten/components";
import { LocalizationContext } from "../../components/Translation";
import { NoInternetIcon } from "../components/ThemedIcons";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const NoInternet = ({ navigation }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "NoInternet method starts here",
      { navigation },
      "NoInternet()",
      "NoInternet.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const styles = useStyleSheet(themedStyles);
  const handleTryAgain = () => {
    navigation.navigage.goBack();
  };
  return (
    <View style={styles.formContainer}>
      <NoInternetIcon />
      <Text category="h1" status="basic">
        {translations["app.noInternet"]}
      </Text>
      <Text category="h1" status="info">
        {translations["app.noInternet.connection"]}
      </Text>
      <Button status="basic" onPress={handleTryAgain}>
        {translations["app.tryAgain"]}
      </Button>
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

export default NoInternet;
