import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../Errors/ErrorUtil";
class AadharPanRequestBody {
  static getTwelveRandomChars() {
    crashlytics().log(
      ErrorUtil.createLog(
        " getTwelveRandomChars method starts here",
        undefined,
        "getTwelveRandomChars()",
        "aadhar-pan-requestbodyheader.js"
      )
    );
    return Math.random().toString(36).substr(1, 12);
  }
  getPanRequestBodyHeaders() {
    let bodyHeader = {
      client_code: "NOVO9516",
      sub_client_code: "NOVO9516",
      channel_code: "WEB",
      channel_verison: "1",
      stan: this.getStan(),
      client_ip: "",
      transmission_datetime: new Date().getTime().toString(),
      operation_mode: "SELF",
      run_mode: "TEST",
      actor_type: "TEST",
      user_handle_type: "EMAIL",
      user_handle_value: "abcd@gmail.com",
      location: "NA",
      function_code: "VERIFY_PAN",
      function_sub_code: "NUMBER",
    };
    crashlytics().log(
      ErrorUtil.createLog(
        " getPanRequestBodyHeaders method starts here",
        undefined,
        "getPanRequestBodyHeaders()",
        "aadhar-pan-requestbodyheader.js"
      )
    );
    return bodyHeader;
  }
  getAadharRequestBodyHeaders() {
    let bodyHeader = {
      client_code: "NOVO9516",
      sub_client_code: "NOVO9516",
      channel_code: "WEB",
      channel_verison: "1",
      stan: this.getStan(),
      client_ip: "",
      transmission_datetime: new Date().getTime().toString(),
      operation_mode: "SELF",
      run_mode: "TEST",
      actor_type: "TEST",
      user_handle_type: "EMAIL",
      user_handle_value: "abcd@gmail.com",
      location: "NA",
      function_code: "VERIFY_AAADHAR",
      function_sub_code: "DATA",
    };
    crashlytics().log(
      ErrorUtil.createLog(
        " getAadharRequestBodyHeaders method starts here",
        undefined,
        "getAadharRequestBodyHeaders()",
        "aadhar-pan-requestbodyheader.js"
      )
    );
    return bodyHeader;
  }
  getStan() {
    crashlytics().log(
      ErrorUtil.createLog(
        " getStan method starts here",
        undefined,
        "getStan()",
        "aadhar-pan-requestbodyheader.js"
      )
    );
    return (
      AadharPanRequestBody.getTwelveRandomChars() + "_" + new Date().getTime()
    );
  }
}

export default AadharPanRequestBody;
