import React from "react";
import { View } from "react-native";
import {
  Text,
  useTheme,
  useStyleSheet,
  StyleService,
} from "@ui-kitten/components";
import { heightPercentageToDP } from "react-native-responsive-screen";
import AmountRangeSelector from "../../../../../AmountRangeSelector";
import { numberWithCommas } from "../utils";
import { LoanAmountDisplayBig } from "../../../../../ValueDisplayComponent";
import { useDispatch } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
const RangeWidget = ({
  value,
  readonly,
  disabled,
  schema,
  onChange,
  rawErrors = [],
  required,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "RangeWidget method starts here ",
      { value, readonly, disabled, schema, onChange, rawErrors, required },
      "RangeWidget()",
      "RangeWidget.js"
    )
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  value = value < schema.minimum ? schema.default : value;
  const styles = useStyleSheet(themedStyles);
  const rangeSpec = (schema) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "rangeSpec method starts here ",
        { schema },
        "rangeSpec()",
        "RangeWidget.js"
      )
    );
    return {
      step: schema.step || 25000,
      min: schema.minimum,
      max: schema.maximum,
    };
  };
  const onChangeLoanAmount = (loanAmount) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onChangeLoanAmount method starts here ",
        { loanAmount },
        "onChangeLoanAmount()",
        "RangeWidget.js"
      )
    );
    dispatch.formDetails.setLoanAmount(loanAmount);
    onChange(loanAmount);
  };
  const { min = 50, step = 1, max = 100 } = rangeSpec(schema);
  const hasErrors = rawErrors.length > 0;

  return (
    <View style={styles.rangeContainer}>
      <LoanAmountDisplayBig value={value} />
      <View style={styles.rangeWidgetContainer}>
        <AmountRangeSelector
          value={value}
          step={step}
          disabled={disabled || readonly}
          minimumValue={min}
          maximumValue={max}
          onChange={onChangeLoanAmount}
          thumbTintColor={theme["color-info-500"]}
          minimumTrackTintColor={theme["color-info-500"]}
        />
      </View>
    </View>
  );
};

const themedStyles = StyleService.create({
  rangeContainer: {
    marginBottom: heightPercentageToDP("5%"),
  },
  rangeWidgetContainer: {
    marginTop: heightPercentageToDP("10%"),
  },
});

export default RangeWidget;
