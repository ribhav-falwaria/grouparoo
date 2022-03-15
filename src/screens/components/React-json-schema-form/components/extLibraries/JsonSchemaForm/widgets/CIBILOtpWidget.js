import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import isEmpty from "lodash.isempty";
import ResourceFactoryConstants from "../../../../services/ResourceFactoryConstants";
import DataService from "../../../../services/DataService";
import OtpComponent from "../../../../../OtpComponent";
import { useRequest } from "ahooks";
import Toast from "react-native-toast-message";
import crashlytics from "@react-native-firebase/crashlytics";
import { LocalizationContext } from "../../../../translation/Translation";
import FormSuccess from "../../../Forms/FormSuccess";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
const resourceFactoryConstants = new ResourceFactoryConstants();
const generateCIBILOtp = async (requestBody) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "generateCIBILOtp method starts here ",
      { requestBody },
      "generateCIBILOtp()",
      "CIBILOtpWidget.js"
    )
  );
  try {
    const response = await DataService.postData(
      resourceFactoryConstants.constants.cibil.sendOTPForCibil,
      requestBody
    );
    const data = response.data;
    if (data.status === "SUCCESS") {
      crashlytics().log("CIBIL OTP Data", data);
      return data;
    } else {
      throw new Error("ERROR_WHILE_OTP_GENERATION");
    }
  } catch (error) {
    crashlytics().log(
      ErrorUtil.createError(
        error,
        error.message,
        error.message,
        { requestBody },
        "generateCIBILOtp()",
        "CIBILOtpWidget.js"
      )
    );
    crashlytics().recordError(error);
    if (error.message === "ERROR_WHILE_OTP_GENERATION") {
      throw error;
    } else {
      throw new Error("ERROR_WHILE_REACHING_TO_CIBIL_SERVER");
    }
  }
};

const validateCibilOtp = async (otp, loanAppId) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "validateCibilOtp method starts here ",
      { otp, loanAppId },
      "validateCibilOtp()",
      "CIBILOtpWidget.js"
    )
  );
  crashlytics().log(
    `Request body while calling ${
      resourceFactoryConstants.constants.cibil.verifyCibilOtp
    } is ${{
      transId: transId,
      otp: otp,
      loanApplicationId: loanAppId,
    }}`
  );
  try {
    const response = await DataService.postData(
      resourceFactoryConstants.constants.cibil.verifyCibilOtp,
      {
        transId: transId,
        otp: otp,
        loanApplicationId: loanAppId,
      }
    );
    const data = response.data;
    console.log("Response Data while otp enter", data);
    if (data.status === "SUCCESS") {
      return true;
    } else {
      throw new Error("FAILED_WHILE_OTP_VALIDATION");
    }
  } catch (error) {
    crashlytics().log(
      ErrorUtil.createError(
        error,
        error.message,
        error.message,
        { otp, loanAppId },
        "validateCibilOtp()",
        "CIBILOtpWidget.js"
      )
    );
    if (error.message === "FAILED_WHILE_OTP_VALIDATION") {
      throw error;
    } else {
      throw new Error("ERROR_WHILE_REACHING_TO_CIBIL_SERVER");
    }
  }
};

const WAIT_RESEND_MS = 2 * 60 * 1000;
const OTP_VALID_MS = 5 * 60 * 1000;
let transId;
const CIBILOtpWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "CIBILOtpWidget method starts here ",
      { props },
      "CIBILOtpWidget()",
      "CIBILOtpWidget.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const [otpValid, setOtpValid] = useState("default");
  const currentFormData = useSelector((state) => state?.formDetails?.formData);
  const loanAppId = currentFormData?.loanApplicationId;
  const panData = useSelector((state) => state?.formDetails?.panData);
  const [isFormValid, setIsValid] = useState(true);

  const isRequiredFieldPresent = (currentFormData, panData) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "isRequiredFieldPresent method starts here ",
        { currentFormData, panData },
        "isRequiredFieldPresent()",
        "CIBILOtpWidget.js"
      )
    );
    if (
      isEmpty(currentFormData) ||
      isEmpty(currentFormData?.primaryPhone) ||
      isEmpty(panData)
    ) {
      return false;
    }
    return true;
  };

  const useGenerateCIBILOtp = useRequest(generateCIBILOtp, {
    manual: true,
    onSuccess: (results, params) => {
      transId = results.transId;
      Toast.show({
        type: "success",
        position: "bottom",
        props: {
          title: translations["cibil.title"],
          description: results.message,
        },
      });
      crashlytics().log("Transaction Id for Cibil", transId);
    },
    onError: (error, params) => {
      if (
        error.message === "ERROR_WHILE_OTP_GENERATION" ||
        error.message === "ERROR_WHILE_REACHING_TO_CIBIL_SERVER"
      ) {
        throw error;
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          props: {
            title: translations["cibil.title"],
            description: translations["cibil.otp.generation.failed"],
          },
        });
      }
    },
  });

  const useValidateCIBILOtp = useRequest(validateCibilOtp, {
    manual: true,
    onSuccess: (results, params) => {
      props.onChange("Yes");
      props.formContext.submit();
      setOtpValid("valid");
      Toast.show({
        type: "success",
        position: "bottom",
        props: {
          title: translations["cibil.title"],
          description: translations["cibil.success"],
        },
      });
    },
    onError: (error, params) => {
      if (error.message === "ERROR_WHILE_REACHING_TO_CIBIL_SERVER") {
        throw error;
      } else {
        Toast.show({
          type: "error",
          position: "bottom",
          props: {
            title: translations["cibil.title"],
            description: translations["cibil.otp.verification.failed"],
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!props.value && isRequiredFieldPresent(currentFormData, panData)) {
      useGenerateCIBILOtp.run(getResquestBodyForCIBIL());
    }
  }, []);

  const getResquestBodyForCIBIL = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "getResquestBodyForCIBIL method starts here ",
        undefined,
        "getResquestBodyForCIBIL()",
        "CIBILOtpWidget.js"
      )
    );
    crashlytics().log("Form Data at CIBIL Widget", currentFormData);
    const names =
      currentFormData?.fullName?.split(" ") ||
      panData?.name.trim().split(" ") ||
      "";
    const dobCibil = panData?.dob ? panData.dob.replace(/\//g, "-") : "";
    const mobileNoWithoutCountryCode = currentFormData?.primaryPhone;
    const payload = {
      loanApplicationId: loanAppId,
      firstName: names.length > 0 ? names[0] : "",
      middleName: names.length > 2 ? names[1] : "",
      lastName: names.length > 2 ? names[2] : names[1],
      mobileNumber: mobileNoWithoutCountryCode,
      emailAddress: currentFormData?.email || "nplending@gmail.com",
      dob: dobCibil,
      idNumber: panData?.panNumber,
      gender: currentFormData?.sex || "Other",
      addressLine1:
        currentFormData?.residentialAddress?.address2 || "Bengaluru",
      addressLine2: currentFormData?.residentialAddress?.address2 || "",
      city: currentFormData?.residentialAddress?.city || "Bengaluru",
      state: currentFormData?.residentialAddress?.state || "29",
      pinCode:
        currentFormData?.residentialAddress?.zipCode?.replace(/ /g, "") ||
        "560103",
    };
    crashlytics().log("CIBIL Body Data", payload);
    return payload;
  };
  useEffect(() => {
    if (props.required && (!isEmpty(props.rawErrors) || props.value === "")) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [props.rawErrors, props.value, props.required]);

  return (
    <View style={styles.rowMargin}>
      {!props.value && (
        <OtpComponent
          primaryPhone={currentFormData.primaryPhone}
          onResendOtp={() => useGenerateCIBILOtp.run(getResquestBodyForCIBIL())}
          loading={useGenerateCIBILOtp.loading || useValidateCIBILOtp.loading}
          onValidateOtp={(otp) => useValidateCIBILOtp.run(otp, loanAppId)}
          otpValid={otpValid}
          numSecondsWaitForResend={WAIT_RESEND_MS}
          otpValidWindow={OTP_VALID_MS}
        />
      )}
      {props.value && (
        <FormSuccess
          description={translations["cibil.success"]}
          isButtonVisible={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default CIBILOtpWidget;
