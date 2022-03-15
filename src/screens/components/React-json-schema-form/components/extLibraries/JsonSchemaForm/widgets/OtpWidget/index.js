import React, { Fragment, useContext, useEffect, useState } from "react";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { View } from "react-native";
import { useCountDown, useInterval } from "ahooks";
import { Text, StyleService, useStyleSheet } from "@ui-kitten/components";
import SpinnerButton from "../../../../../../SpinnerButton";
import { LocalizationContext } from "../../../../../translation/Translation";
import { useSelector, useStore } from "react-redux";
import LoadingSpinner from "../../../../../../../components/LoadingSpinner";
import ReactJsonSchemaUtil from "../../../../../services/ReactJsonSchemaFormUtil";
import { useToast } from "react-native-toast-notifications";
import DataService from "../../../../../services/DataService";
import ResourceFactoryConstants from "../../../../../services/ResourceFactoryConstants";
import FormSuccess from "../../../../Forms/FormSuccess";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../../Errors/ErrorUtil";
const NUM_RETRIES = 5;
const NUM_SEC_WAIT = 60000; // 60 seconds
const OTP_VALID_WINDOW = 300000; // 5 minutes
const padNum = (num, pad) => {
  const str = num.toString();
  return pad.substring(0, pad.length - str.length) + str;
};

const Otp = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "Otp method starts here ",
      { props },
      "Otp()",
      "OtpWidget.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const { onChange } = props;
  const toast = useToast();
  const [loaderVisibility, setLoaderVisibility] = useState(false);
  const primaryPhone = useSelector(
    (state) => state.formDetails.formData.primaryPhone
  );
  const verifiedPhoneNumber = useSelector(
    (state) => state.formDetails.verifiedPhoneNumber
  );
  const [counter, setCounter] = useState(NUM_RETRIES);

  // Generate OTP if PrimaryPhone is there
  useEffect(() => {
    if (
      primaryPhone &&
      primaryPhone.length === 10 &&
      verifiedPhoneNumber !== primaryPhone
    ) {
      generateOtp();
    }
  }, [primaryPhone]);

  const generateOtp = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "generateOtp method starts here ",
        { props },
        "generateOtp()",
        "OtpWidget.js"
      )
    );
    setLoaderVisibility(true);
    ReactJsonSchemaUtil.generateOTP(primaryPhone)
      .then((res) => {
        const responseData = res?.data;
        if (responseData?.status !== "SUCCESS") {
          toast.show(responseData.message, { type: "danger" });
        }
        setLoaderVisibility(false);
      })
      .catch((err) => {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            { props },
            "generateOtp()",
            "OtpWidget.js"
          )
        );
        toast.show(err.message, { type: "danger" });
        setLoaderVisibility(false);
      });
  };

  const onResendOtp = async () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "onResendOtp method starts here ",
        { props },
        "onResendOtp()",
        "OtpWidget.js"
      )
    );
    if (counter > 0) {
      setCounter(counter - 1);
    } else {
      setCounter(0);
    }
  };
  return (
    <>
      <LoadingSpinner visible={loaderVisibility} />
      {primaryPhone !== verifiedPhoneNumber && (
        <OtpContent
          counter={counter}
          primaryPhone={primaryPhone}
          onResendOtp={onResendOtp}
          loading
          onChange={onChange}
          formRef={props.formContext}
        />
      )}
      {primaryPhone === verifiedPhoneNumber && (
        <FormSuccess
          description={translations["mobile.otp.validate"]}
          isButtonVisible={false}
        />
      )}
    </>
  );
};

const OtpContent = ({
  counter,
  primaryPhone,
  onResendOtp,
  loading,
  onChange,
  formRef,
}) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "OtpContent method starts here ",
      { counter, primaryPhone, onResendOtp, loading, onChange, formRef },
      "OtpContent()",
      "OtpWidget.js"
    )
  );
  const { translations } = useContext(LocalizationContext);
  const styles = useStyleSheet(themedStyles);
  const [loaderVisibility, setLoaderVisibility] = useState(false);
  const store = useStore();
  const toast = useToast();
  // Run the fet OTP on mount
  // Manage number of retries
  const [isTimeout, setTimeout] = useState(false);
  // Managing countdown of otp validity
  const [countdown] = useCountDown({
    targetDate: Date.now() + OTP_VALID_WINDOW,
    onEnd: () => setTimeout(true),
  });
  const seconds = parseInt(countdown / 1000);
  const formattedResult = {
    minutes: padNum(parseInt(seconds / 60), "0"),
    seconds: padNum(seconds % 60, "00"),
  };
  const waitSeconds = parseInt((OTP_VALID_WINDOW - countdown) / 1000);
  const [disabled, setDisabled] = useState(true);
  useInterval(() => {
    setDisabled(false);
  }, NUM_SEC_WAIT);
  const waitSecondsStr = padNum(NUM_SEC_WAIT / 1000 - waitSeconds, "00");
  // Manage enable resend otp after NUM_SEC_WAIT timeout

  const resendOtp = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        "resendOtp method starts here ",
        undefined,
        "resendOtp()",
        "OtpWidget.js"
      )
    );
    setTimeout(false);
    setDisabled(true);
    onResendOtp();
  };
  const verifyCode = (code) => {
    crashlytics().log(
      ErrorUtil.createLog(
        "verifyCode method starts here ",
        { code },
        "verifyCode()",
        "OtpWidget.js"
      )
    );
    if (code.length !== 6) {
      return;
    }
    setLoaderVisibility(true);
    const resourseFactoryConstants = new ResourceFactoryConstants();
    const requestBody = {
      mob: primaryPhone,
      otp: Number(code),
    };
    DataService.postData(
      `${resourseFactoryConstants.constants.otp.validateOTP}`,
      requestBody
    )
      .then((res) => {
        const responseData = res?.data;
        if (responseData?.status === "SUCCESS") {
          onChange("Yes");
          store.dispatch.formDetails.setverifiedPhoneNumber(primaryPhone);
          store.dispatch.formDetails.setIsPrimaryPhoneVerified("Yes");
          // document.getElementById("proceedButton").click();
          formRef.submit(); // if number is verified, will skip the step
        } else {
          toast.show("OTP is invalid.", { type: "danger" });
        }
        setLoaderVisibility(false);
      })
      .catch((err) => {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            { code },
            "verifyCode()",
            "OtpWidget.js"
          )
        );
        toast.show(err.message, { type: "danger" });
        setLoaderVisibility(false);
      });
  };
  return (
    <>
      <LoadingSpinner visible={loaderVisibility} />
      <View style={styles.otpContainer}>
        <Text style={styles.subHeading} status="primary" category="h6">
          {translations.formatString(translations["otp.sentOtpToMobile"], {
            primaryPhone,
          })}
        </Text>
        <OTPInputView
          style={styles.otp}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={verifyCode}
        />
        <View style={styles.actionRow}>
          <View>
            <Text category="c1" status="primary">
              {isTimeout === false &&
                translations.formatString(
                  translations["otp.otpTimer"],
                  formattedResult
                )}
              {isTimeout === true && translations["otp.otpTimeout"]}
            </Text>
          </View>
          <View>
            <SpinnerButton
              style={styles.actionButton}
              loading={loading}
              appearance="outline"
              disabled={disabled || loading}
              status="primary"
              size="tiny"
              onPress={resendOtp}
            >
              {disabled === true &&
                translations.formatString(translations["otp.waitingFor"], {
                  waitSecondsStr,
                })}
              {disabled === false && translations["otp.resend"]}
            </SpinnerButton>
          </View>
        </View>
        <>
          {counter < 5 && (
            <Text appearence="hint" category="c1" status="info">
              {loading === true && translations["otp.sendingOtp"]}
              {loading === false &&
                translations.formatString(translations["otp.sentOtp"], {
                  primaryPhone,
                })}
            </Text>
          )}
        </>
        <Text
          appearence="hint"
          category="s1"
          status={counter <= 2 ? "warning" : "basic"}
        >
          {translations.formatString(translations["otp.numberOfRetries"], {
            counter,
          })}
        </Text>
      </View>
    </>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  actionRow: {
    paddingVertical: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  otpContainer: {
    marginVertical: 100,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  otp: {
    height: 100,
    width: "80%",
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "color-primary-300",
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 3,
    borderBottomWidth: 3,
    borderColor: "border-basic-color-5",
    color: "color-primary-500",
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  underlineStyleHighLighted: {
    borderColor: "color-primary-300",
  },
});

export default Otp;
