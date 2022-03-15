import React, { useContext, useState } from "react";
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";

import { useFormContext } from "../FormContext";
import { LocalizationContext } from "../../../../translation/Translation";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const getLabelFromValue = (options, value) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "getLabelFromValue method starts here ",
      { options, value },
      "getLabelFromValue()",
      "SelectWidget.js"
    )
  );
  const option = options.find((element) => element.value === value);
  return option?.label;
};

const SelectWidget = ({
  id,
  options,
  value,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
  onFocus,
  autofocus,
  onBlur,
  schema,
  required,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "SelectWidget method starts here ",
      {
        id,
        options,
        value,
        disabled,
        readonly,
        onChange,
        rawErrors,
        onFocus,
        autofocus,
        onBlur,
        schema,
        required,
      },
      "SelectWidget()",
      "SelectWidget.js"
    )
  );
  const { enumOptions, enumDisabled } = options;
  const { translations } = useContext(LocalizationContext);
  const { radioLabelMapping } = useFormContext();
  const hasErrors = rawErrors?.length > 0;
  const [selectedValue, setSelectedValue] = useState(
    value ? getLabelFromValue(enumOptions, value) : ""
  );
  const [selectedIndex, setSelectedIndex] = useState("");
  const onPress = (index) => {
    const title = enumOptions[index.row]["label"];
    const value = enumOptions[index.row]["value"];
    setSelectedValue(title);
    setSelectedIndex(new IndexPath(index.row));
    onChange(value);
  };
  return (
    <Select
      placeholder={translations["select.placeholder"]}
      onBlur={() => {
        onBlur(id, value);
      }}
      onFocus={() => {
        onFocus(id, value);
      }}
      value={selectedValue}
      autofocus={autofocus}
      selectedIndex={selectedIndex}
      onSelect={onPress}
      status={hasErrors && "danger"}
      disabled={disabled || readonly}
    >
      {enumOptions.map((option, i) => {
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1;
        const label = radioLabelMapping
          ? radioLabelMapping(option.label)
          : option.label;
        return (
          <SelectItem
            key={`selopt-${i}`}
            title={label}
            disabled={itemDisabled}
          />
        );
      })}
    </Select>
  );
};

export default SelectWidget;
