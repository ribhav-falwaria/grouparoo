import format from "string-format";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
const endpoints = {
  getSchemaAndSteps:
    "https://dev-codeapp.novopay.in/novocode/getSchemaAndStepsByName?formName={name}&schemaSteps={schemaSteps}",
  getUiSchemaByName:
    "https://dev-codeapp.novopay.in/novocode/getUiSchemaByName?formName={formName}",
  getStepsByName:
    "https://dev-codeapp.novopay.in/novocode/getSchemaStepsById?formName={formName}&stepName={}",
};
const getApplicationFormById = async (formName, obj) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " getApplicationFormById method starts here",
      { formName, obj },
      "getApplicationFormById()",
      "applicationFormService.js"
    )
  );
  try {
    const response = await fetch(
      format(endpoints.getSchemaAndSteps, {
        formName,
        schemaSteps: obj.schemaSteps,
      })
    );
    const data = await response.json();
    if (data.status.toLowerCase() === "success") {
      data.id = formName;
      return data;
    }
  } catch (err) {
    crashlytics().log(
      ErrorUtil.createError(
        err,
        err.message,
        err.message,
        { formName, obj },
        "getApplicationFormById()",
        "applicationFormService.js"
      )
    );
    console.log(err.message);
    return {};
  }
};
export default {
  getApplicationFormById,
};
