import format from "string-format";
import { customAlphabet } from "nanoid/non-secure";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
const endpoints = {
  saveFormDataName: "https://dev-codeapp.novopay.in/novocode/updateActionForm",
  getFormDataByName:
    "https://dev-codeapp.novopay.in/novocode/getActionFormByName?formName={formName}&formDocId={_id}",
};

const updateLoanApplication = async (customerId, { formData, formName }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " updateLoanApplication method starts here",
      { formData, formName, customerId },
      "updateLoanApplication()",
      "loanApplicationService.js"
    )
  );
  try {
    const response = await fetch(endpoints.saveFormDataById, {
      method: "POST",
      body: {
        formName,
        values: formData,
        userId: customerId,
      },
    });
    const data = await response.json();
    if (data.status.toLowerCase() === "success") {
      if (data.actionForm) {
        return {
          id: data.actionForm.values.id,
          data: {
            values: data.actionForm.formData,
            errors: data.actionForm.errors || {},
            formName,
          },
        };
      } else {
        // dummy
        return {
          id: formData.id || nanoid(),
          data: {
            formData,
            formName,
            errors: {},
          },
        };
      }
    }
  } catch (err) {
    crashlytics().log(
      ErrorUtil.createError(
        err,
        err.message,
        err.message,
        { formData, formName, customerId },
        "updateLoanApplication()",
        "loanApplicationService.js"
      )
    );
    console.log(err.message);
    return {};
  }
};
const getLoanApplication = async (id, { formName }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " getLoanApplication method starts here",
      { id, formName },
      "getLoanApplication()",
      "loanApplicationService.js"
    )
  );
  try {
    const response = await fetch(
      format(endpoints.getFormDataByName, { id: id, formName })
    );
    const data = await response.json();
    if (data.status.toLowerCase() === "success") {
      return {
        id,
        data: {
          formData: data.formAction.values,
          formName,
        },
      };
    }
  } catch (err) {
    crashlytics().log(
      ErrorUtil.createError(
        err,
        err.message,
        err.message,
        { id, formName },
        "getLoanApplication()",
        "loanApplicationService.js"
      )
    );
    console.log(err.message);
    return {};
  }
};

export default {
  getLoanApplication,
  updateLoanApplication,
};
