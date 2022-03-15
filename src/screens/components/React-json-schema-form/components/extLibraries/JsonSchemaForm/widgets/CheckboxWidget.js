import React from "react";
import { CheckBox } from "@ui-kitten/components";
import DescriptionField from "../fields/DescriptionField";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const CheckboxWidget = ({
  value,
  disabled,
  readonly,
  label,
  onChange,
  schema,
  rawErrors = [],
  required,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "CheckboxWidget method starts here ",
      {
        value,
        disabled,
        readonly,
        label,
        onChange,
        schema,
        rawErrors,
        required,
      },
      "CheckboxWidget()",
      "CheckboxWidget.js"
    )
  );
  const isDisabled = readonly || disabled;
  const hasErrors = rawErrors.length > 0;

  return (
    <>
      {schema.description ? (
        <DescriptionField description={schema.description} />
      ) : null}
      <CheckBox
        checked={value}
        onChange={onChange}
        disabled={isDisabled || readonly}
        status={hasErrors && "danger"}
      >
        {schema.title || label}
      </CheckBox>
    </>
  );
};

export default CheckboxWidget;
