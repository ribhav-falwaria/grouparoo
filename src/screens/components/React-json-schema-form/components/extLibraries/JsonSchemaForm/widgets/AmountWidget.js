import React from "react";
import MaskedInput from "../../textMask/text-input-mask";
import { Text } from "@ui-kitten/components";
import { useFormContext } from "../FormContext";

const AmountWidget = ({
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
  const { theme } = useFormContext();
  const hasErrors = rawErrors.length > 0;
  return (
    <MaskedInput
      type="money"
      options={{
        precision: 0,
        separator: ".",
        delimiter: ",",
        suffixUnit: "",
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
        onChange(rawText === "" ? options.emptyValue : parseInt(rawText))
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
      accessoryLeft={() => <Text>Rs.</Text>}
    />
  );
};

export default AmountWidget;
