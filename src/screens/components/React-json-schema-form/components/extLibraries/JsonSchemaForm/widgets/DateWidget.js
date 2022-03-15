import React from "react";
import dayjs from "dayjs";
import MaskedInput from "../../textMask/text-input-mask";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

import { useFormContext } from "../FormContext";

const DateWidget = ({
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
      "DateWidget method starts here ",
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
      "DateWidget()",
      "DateWidget.js"
    )
  );
  const { theme } = useFormContext();
  const format = "DD-MM-YYYY";
  const hasErrors = rawErrors.length > 0;

  return (
    <MaskedInput
      type="datetime"
      options={{
        mask: format,
      }}
      includeRawValueInChangeText
      multiline={multiline}
      placeholder={label}
      autoFocus={autofocus}
      editable={!disabled && !readonly}
      keyboardType={schema.type === "number" ? "numeric" : "default"}
      value={value ? value.toString() : ""}
      secureTextEntry={secureEntry}
      textContentType={textContentType}
      onChangeText={(newText, rawText) =>
        onChange(newText === "" ? options.emptyValue : dayjs(newText, format))
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

export default DateWidget;
