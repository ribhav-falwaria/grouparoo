import React from "react";
import MaskedInput from "../../textMask/text-input-mask";

import { useFormContext } from "../FormContext";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const PincodeWidget = ({
  id,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  multiline,
  secureEntry,
  schema,
  textContentType = "none",
  rawErrors = [],
  required,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "PincodeWidget method starts here ",
      {
        id,
        readonly,
        disabled,
        label,
        value,
        onChange,
        onBlur,
        onFocus,
        autofocus,
        options,
        multiline,
        secureEntry,
        schema,
        textContentType,
        rawErrors,
        required,
      },
      "PincodeWidget()",
      "PincodeWidget.js"
    )
  );
  const { theme } = useFormContext();
  const hasErrors = rawErrors.length > 0;

  return (
    <MaskedInput
      type="zip-code"
      includeRawValueInChangeText
      multiline={multiline}
      placeholder={label}
      autoFocus={autofocus}
      editable={!disabled && !readonly}
      keyboardType="numeric"
      value={value ? value.toString() : ""}
      secureTextEntry={secureEntry}
      textContentType={textContentType}
      onChangeText={(newText) =>
        onChange(newText === "" ? options.emptyValue : newText)
      }
      onBlur={() => {
        onBlur(id, value);
      }}
      onFocus={() => {
        onFocus(id, value);
      }}
      selectionColor={theme.highlightColor}
      placeholderTextColor={theme.placeholderTextColor}
      status={hasErrors && "danger"}
    />
  );
};

export default PincodeWidget;
