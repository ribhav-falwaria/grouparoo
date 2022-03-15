import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import TitleField from "./TitleField";
import DescriptionField from "./DescriptionField";
import { useFormContext } from "../FormContext";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const FieldTemplate = ({
  label,
  children,
  displayLabel,
  rawErrors = [],
  rawHelp,
  required,
  rawDescription,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "FieldTemplate method starts here ",
      {
        label,
        children,
        displayLabel,
        rawErrors,
        rawHelp,
        required,
        rawDescription,
      },
      "FieldTemplate()",
      "FieldTemplate.js"
    )
  );
  const { theme } = useFormContext();
  const hasErrors = rawErrors?.length > 0;
  return (
    <View style={styles.container}>
      {displayLabel && label ? (
        <TitleField title={label} required={required} hasErrors={hasErrors} />
      ) : null}
      {children}
      {displayLabel && rawDescription ? (
        <DescriptionField description={rawDescription} />
      ) : null}
      {hasErrors &&
        rawErrors.map((error, i) => (
          <Text
            key={i}
            style={[
              styles.description,
              styles.error,
              { color: theme.errorColor },
            ]}
          >
            {"\u2022"} {error}
          </Text>
        ))}
      {rawHelp?.length > 0 && (
        <Text category="c1" appearence="hint" status="info">
          {rawHelp}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  error: {
    marginTop: 5,
  },
});

export default FieldTemplate;
