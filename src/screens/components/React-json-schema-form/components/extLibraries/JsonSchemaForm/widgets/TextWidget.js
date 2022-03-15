import React from "react";
import { Input } from "@ui-kitten/components";

import { useFormContext } from "../FormContext";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const TextWidget = ({
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
      "TextWidget method starts here ",
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
      "TextWidget()",
      "TextWidget.js"
    )
  );
  const { theme } = useFormContext();
  const hasErrors = rawErrors.length > 0;

  return (
    <Input
      multiline={multiline}
      placeholder={label}
      autoFocus={autofocus}
      editable={!disabled && !readonly}
      keyboardType={schema.type === "number" ? "numeric" : "default"}
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

export default TextWidget;
