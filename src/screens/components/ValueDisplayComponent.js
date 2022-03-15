import React from "react";
import { View } from "react-native";
import {
  Text,
  StyleService,
  useStyleSheet,
  Button,
} from "@ui-kitten/components";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { rupeeFormatter } from "../../utils";
import { EditIcon, CheckIconGreen } from "./ThemedIcons";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const AmountDisplay = ({ label, amount, horizontal }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "AmountDisplay method starts here",
      { label, amount, horizontal },
      "AmountDisplay()",
      "ValueDisplayComponent.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  return (
    <View
      style={
        horizontal
          ? styles.loanAmountContainerHorizontal
          : styles.loanAmountContainer
      }
    >
      <View>
        <Text category="label">{label}</Text>
      </View>
      <View>
        <Text category="h6">
          <Text category="label">{"₹ "}</Text>
          {rupeeFormatter(amount)}
        </Text>
      </View>
    </View>
  );
};

const InterestDisplay = ({ label, interestRate, horizontal }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "InterestDisplay method starts here",
      { label, interestRate, horizontal },
      "InterestDisplay()",
      "ValueDisplayComponent.js"
    )
  );
  const styles = useStyleSheet(themedStyles);

  return (
    <View
      style={
        horizontal
          ? styles.loanAmountContainerHorizontal
          : styles.loanAmountContainer
      }
    >
      <View>
        <Text category="label">{`${label}  `}</Text>
      </View>
      <View>
        <Text category="h6">
          {interestRate}
          <Text category="label">{"% "}</Text>
        </Text>
      </View>
    </View>
  );
};

const LoanAmountDisplayBig = ({
  value,
  hasEdit,
  editLoanAmount,
  setEditLoanAmount,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "LoanAmountDisplayBig method starts here",
      { value, hasEdit, editLoanAmount, setEditLoanAmount },
      "LoanAmountDisplayBig()",
      "ValueDisplayComponent.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  return (
    <View style={styles.amountDisplay}>
      <View style={styles.withIconContainer}>
        <Text category="h3" status="primary">
          <Text category="p1" status="primary">
            {"₹ "}
          </Text>
          {rupeeFormatter(value)}
        </Text>
      </View>
      {hasEdit && (
        <View style={styles.iconContainer}>
          {!editLoanAmount && (
            <Button
              accessoryLeft={EditIcon}
              size="small"
              appearance="ghost"
              onPress={() => setEditLoanAmount(true)}
            />
          )}
          {editLoanAmount && (
            <Button
              size="small"
              appearance="ghost"
              accessoryLeft={CheckIconGreen}
              onPress={() => setEditLoanAmount(false)}
            />
          )}
        </View>
      )}
    </View>
  );
};
const themedStyles = StyleService.create({
  loanAmountContainer: {
    alignItems: "center",
  },
  loanAmountContainerHorizontal: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  amountDisplay: {
    marginVertical: heightPercentageToDP("5%"),
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "color-primary-100",
    padding: 8,
    borderRadius: 36,
    marginHorizontal: 16,
  },
  withIconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconContainer: {
    alignSelf: "flex-end",
    marginLeft: 8,
    marginTop: 4,
  },
});
export { AmountDisplay, InterestDisplay, LoanAmountDisplayBig };
