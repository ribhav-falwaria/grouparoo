import RNOtpVerify from 'react-native-otp-verify';
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../../Errors/ErrorUtil";

getHash = () =>
crashlytics().log(
    ErrorUtil.createLog(
      "getHash method starts here ",
      undefined,
      "getHash()",
      "OtpVerify.js"
    )
  );
    RNOtpVerify.getHash()
    .then(console.log)
    .catch(console.log);

startListeningForOtp = () =>
    RNOtpVerify.getOtp()
    .then(p => RNOtpVerify.addListener(this.otpHandler))
    .catch(p => console.log(p));

 otpHandler = (message) => {
    crashlytics().log(
        ErrorUtil.createLog(
          "otpHandler method starts here ",
          undefined,
          "otpHandler()",
          "OtpVerify.js"
        )
      );
        const otp = /(\d{4})/g.exec(message)[1];
        this.setState({ otp });
        RNOtpVerify.removeListener();
        Keyboard.dismiss();
}

 componentWillUnmount() {
    RNOtpVerify.removeListener();
 }