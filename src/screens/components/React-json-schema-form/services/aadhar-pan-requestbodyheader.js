class AadharPanRequestBody {
  static getTwelveRandomChars() {
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
    return bodyHeader;
  }
  getStan() {
    return (
      AadharPanRequestBody.getTwelveRandomChars() + "_" + new Date().getTime()
    );
  }
}

export default AadharPanRequestBody;
