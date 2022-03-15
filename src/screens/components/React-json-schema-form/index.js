import React, { useContext } from "react";
import { LocalizationContext } from "./translation/Translation";
import ApplicationForm from "./ApplicationForm";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../Errors/ErrorUtil";

const ReactNativeJsonSchemaForm = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "ReactNativeJsonSchemaForm method starts here",
      { props },
      "ReactNativeJsonSchemaForm()",
      "ReactNativeJsonSchemaForm.js"
    )
  );
  const { initializeAppLanguage } = useContext(LocalizationContext);
  initializeAppLanguage();
  return (
    <>
      <ApplicationForm
        formId={props.formId}
        stepSchemaName={props.stepSchemaName}
        token={props.token}
        currentFormData={props.currentFormData}
      />
    </>
  );
};

export default ReactNativeJsonSchemaForm;
