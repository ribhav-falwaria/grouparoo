import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

import {
  getUiOptions,
  getWidget,
  guessType,
  retrieveSchema,
  getDefaultFormState,
  getMatchingOption,
} from "../utils";

const _getMatchingOption = ({
  formData,
  options,
  rootSchema,
  selectedOptionIndex,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "_getMatchingOption method starts here ",
      { formData, options, rootSchema, selectedOptionIndex },
      "_getMatchingOption()",
      "MultiSchemaField.js"
    )
  );
  const option = getMatchingOption(formData, options, rootSchema);
  if (option !== 0) {
    return option;
  }
  // If the form data matches none of the options, use the currently selected
  // option, assuming it's available; otherwise use the first option
  return selectedOptionIndex;
};

const AnyOfField = ({
  formData,
  options,
  registry,
  onChange,
  baseType,
  disabled,
  errorSchema,
  idPrefix,
  idSchema,
  onBlur,
  onFocus,
  uiSchema,
  schema,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "AnyOfField method starts here ",
      {
        formData,
        options,
        registry,
        onChange,
        baseType,
        disabled,
        errorSchema,
        idPrefix,
        idSchema,
        onBlur,
        onFocus,
        uiSchema,
        schema,
      },
      "AnyOfField()",
      "MultiSchemaField.js"
    )
  );
  // rootSchema is in registry but is not defined FieldProps
  // @ts-ignore
  const { rootSchema } = registry;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    _getMatchingOption({
      formData,
      options,
      rootSchema,
      selectedOptionIndex: 0,
    })
  );

  useEffect(() => {
    const matchingOption = _getMatchingOption({
      formData,
      options,
      rootSchema,
      selectedOptionIndex,
    });
    if (matchingOption !== selectedOptionIndex) {
      setSelectedOptionIndex(matchingOption);
    }
  }, [
    formData,
    setSelectedOptionIndex,
    selectedOptionIndex,
    options,
    rootSchema,
  ]);

  const onOptionChange = (value) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onOptionChange method starts here ",
        { value },
        "onOptionChange()",
        "MultiSchemaField.js"
      )
    );
    const selected = parseInt(value, 10);
    const newOption = retrieveSchema(options[selected], rootSchema, formData);

    // If the new value is of type object and the current data is an object,
    // discard properties added using the old option.
    let newFormData;
    if (
      guessType(formData) === "object" &&
      (newOption.type === "object" || newOption.properties)
    ) {
      newFormData = Object.assign({}, formData);

      const optionsToDiscard = options.slice();
      optionsToDiscard.splice(selectedOptionIndex, 1);

      // Discard any data added using other options
      for (const option of optionsToDiscard) {
        if (option.properties) {
          for (const key in option.properties) {
            if (newFormData[key]) {
              delete newFormData[key];
            }
          }
        }
      }
    }
    // Call getDefaultFormState to make sure defaults are populated on change.
    onChange(
      getDefaultFormState(options[selectedOptionIndex], newFormData, rootSchema)
    );

    setSelectedOptionIndex(parseInt(value, 10));
  };

  const SchemaField = registry.fields.SchemaField;
  const { widgets } = registry;
  // @ts-ignore
  const { widget = "select", ...uiOptions } = getUiOptions(uiSchema);
  const Widget = getWidget({ type: "number" }, widget, widgets);
  const selectedOption = options[selectedOptionIndex] || null;
  let optionSchema;

  if (selectedOption) {
    // If the subschema doesn't declare a type, infer the type from the
    // parent schema
    optionSchema = selectedOption.type
      ? selectedOption
      : Object.assign({}, selectedOption, { type: baseType });
  }

  const enumOptions = options.map((option, index) => ({
    label: option.title || `Option ${index + 1}`,
    value: index,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Widget
          id={`${idSchema.$id}${
            schema.oneOf ? "__oneof_select" : "__anyof_select"
          }`}
          schema={{ type: "number", default: 0 }}
          onChange={onOptionChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={selectedOptionIndex}
          options={{ enumOptions }}
          {...uiOptions}
        />
      </View>

      {selectedOption !== null && (
        <SchemaField
          schema={optionSchema}
          uiSchema={uiSchema}
          errorSchema={errorSchema}
          idSchema={idSchema}
          idPrefix={idPrefix}
          formData={formData}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={registry}
          disabled={disabled}
        />
      )}
    </View>
  );
};
export default AnyOfField;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#979B9E",
    padding: 15,
  },
  formGroup: {
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
});
