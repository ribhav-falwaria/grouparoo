import {
  Button,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import React, { useContext } from "react";
import { PaymentSuccessIcon } from "../../../ThemedIcons";
import { View } from "react-native";
import { LocalizationContext } from "../../translation/Translation";
const FormSuccess = () => {
  const styles = useStyleSheet(themedStyles);
  const { translations } = useContext(LocalizationContext);
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <PaymentSuccessIcon />
        <Text category={"h1"} status="success">
          {translations.success}
        </Text>
        <Text category={"s1"} status="primary">
          {translations["final.submit.message"]}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button status={"primary"}>{translations["text.okay"]}</Button>
      </View>
    </View>
  );
};

const themedStyles = StyleService.create({
  iconContainer: {
    flex: 1,
    height: widthPercentageToDP(50),
    width: widthPercentageToDP(100),
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    height: heightPercentageToDP(100),
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    width: widthPercentageToDP(90),
  },
});

export default FormSuccess;
