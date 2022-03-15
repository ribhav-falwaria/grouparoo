import axios from "axios";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../Errors/ErrorUtil";

const DataService = {
  getData: function (url) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getData method starts here",
        { url },
        "getData()",
        "DataService.js"
      )
    );
    return axios.get(url);
  },
  postData: (url, requestBody) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " postData method starts here",
        { url, requestBody },
        "postData()",
        "DataService.js"
      )
    );
    return axios.post(url, requestBody);
  },
  postDataV1: (url, requestBody, config) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " postDataV1 method starts here",
        { url, requestBody, config },
        "postDataV1()",
        "DataService.js"
      )
    );
    return axios.post(url, requestBody, config);
  },
  getDataV1: (url, config) => {
    crashlytics().log(
      ErrorUtil.createLog(
        " getDataV1 method starts here",
        { url, config },
        "getDataV1()",
        "DataService.js"
      )
    );
    return axios.get(url, config);
  },
};

export default DataService;
