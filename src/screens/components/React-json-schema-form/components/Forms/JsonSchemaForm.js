import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useStore } from "react-redux";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

import { RNForm } from "../extLibraries/JsonSchemaForm";
const JsonSchemaForm = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "JsonSchemaForm method starts here",
      { props },
      "JsonSchemaForm()",
      "JsonSchemaForm.js"
    )
  );
  const store = useStore();
  const {
    formData,
    schema,
    uiSchema,
    onSubmit,
    liveValidate,
    stepIndex,
    onError,
    setFormRef,
    validate,
    onChange,
  } = props;
  const [rnFormData, setRnFormdata] = useState(formData || {});
  const [cntxt, setContext] = useState();
  const onFormDataUpdateHandler = (event) => {
    setRnFormdata(event.formData);
    store.dispatch.formDetails.setFormData(event.formData);
    onChange(event);
  };

  return (
    <KeyboardAwareScrollView>
      <RNForm
        ref={(form) => {
          setFormRef(form);
          setContext(form);
        }}
        onError={onError}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={(form) => onSubmit(form, stepIndex)}
        formData={rnFormData || {}}
        liveValidate={liveValidate}
        validate={validate}
        onChange={onFormDataUpdateHandler}
        formContext={cntxt}
        showErrorList={false}
      >
        {props.children}
      </RNForm>
    </KeyboardAwareScrollView>
  );
};

export default JsonSchemaForm;
