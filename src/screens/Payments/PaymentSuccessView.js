import React, { useContext } from "react";
import { View } from "react-native";
import {
  Button,
  StyleService,
  useStyleSheet,
  Text,
} from "@ui-kitten/components";
import { LocalizationContext } from "../../components/Translation";
import { PaymentSuccessIcon } from "../components/ThemedIcons";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const PaymentSuccessView = ({ onRetry, onCancel }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "PaymentSuccessView method starts here",
      { onRetry, onCancel },
      "PaymentSuccessView()",
      "PaymentSuccessView.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <PaymentSuccessIcon />
        <Text category="h6" status="success">
          {translations["repayment.repaySuccess"]}
        </Text>
      </View>
      <View>
        <View style={{ marginTop: 16 }}>
          <Button onPress={onCancel} appearance="ghost">
            {translations["modal.ok"]}
          </Button>
        </View>
      </View>
    </View>
  );
};
const themedStyles = StyleService.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.8,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
export default PaymentSuccessView;
