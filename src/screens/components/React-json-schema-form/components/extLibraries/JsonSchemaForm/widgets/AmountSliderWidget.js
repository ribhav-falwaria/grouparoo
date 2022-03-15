import { StyleService, Text, useStyleSheet } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useFormContext } from "../FormContext";
import isEmpty from "lodash.isempty";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const AmountSliderWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "AmountSliderWidget method starts here ",
      { props },
      "AmountSliderWidget()",
      "AmountSliderWidget.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  const { theme } = useFormContext();
  const [isFormValid, setIsValid] = useState(true);
  const hasErrors = props.rawErrors?.length > 0;
  const schema = props.schema;
  const min = schema.min || 50000;
  const max = schema.max || 300000;
  const step = schema.step || 25000;
  const val = props.value || min;

  let percentage = ((val - min) / (max - min)) * 100;

  useEffect(() => {
    if (props.required && (!isEmpty(props.rawErrors) || props.value === 0)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [props.rawErrors, props.value, props.required]);

  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
});
export default AmountSliderWidget;
