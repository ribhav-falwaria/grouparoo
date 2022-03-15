import axios from "axios";
import { config } from "../config";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
const sendOtp = async (mobileNumber) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " sendOtp method starts here",
      { mobileNumber },
      "sendOtp()",
      "otpService.js"
    )
  );
  const response = await axios.post(config.otp.sendOtp, { mob: mobileNumber });
  if (response.data.status.toLowerCase() === "failed") {
    throw new Error("CANNOT_SEND_OTP");
  }
};

const validateOtp = async (mobileNumber, otpNumber) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " validateOtp method starts here",
      { mobileNumber, otpNumber },
      "validateOtp()",
      "otpService.js"
    )
  );
  const response = await axios.post(config.otp.validateOtp, {
    mob: mobileNumber,
    otp: parseInt(otpNumber),
  });
  if (response.data.status.toLowerCase() === "failed") {
    return {
      status: false,
    };
  } else {
    return {
      status: true,
    };
  }
};

export default {
  sendOtp,
  validateOtp,
};
