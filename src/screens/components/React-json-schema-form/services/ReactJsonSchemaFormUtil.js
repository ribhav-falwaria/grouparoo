import DataService from "./DataService";
import ResourceFactoryConstants from "./ResourceFactoryConstants";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../Errors/ErrorUtil";
import dayjs from "dayjs";
// import imageCompression from "browser-image-compression";

const ReactJsonSchemaUtil = {
  numberWithCommas(x) {
    crashlytics().log(
      ErrorUtil.createLog(
        " numberWithCommas method starts here",
        { x },
        "numberWithCommas()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    x = x.toString();
    let lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  },
  generateOTP(primaryPhone) {
    crashlytics().log(
      ErrorUtil.createLog(
        " generateOTP method starts here",
        { primaryPhone },
        "generateOTP()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    return DataService.postData(
      `${new ResourceFactoryConstants().constants.otp.generateOTP}`,
      {
        mob: primaryPhone,
      }
    );
  },
  getMaskedAadhar(aadhar) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getMaskedAadhar method starts here",
        { aadhar },
        "getMaskedAadhar()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    const prefix = "XXXX XXXX ";
    const suffix = aadhar.toString().substring(10);
    return prefix + suffix;
  },
  formatDateToDefaultDate(date, actualFormat, newformat = "MM/DD/YYYY") {
    crashlytics().log(
      ErrorUtil.createLog(
        " formatDateToDefaultDate method starts here",
        { date, actualFormat, newformat },
        "formatDateToDefaultDate()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    return dayjs(date, actualFormat).format(newformat);
  },
  getRandomUUID() {
    crashlytics().log(
      ErrorUtil.createLog(
        " getRandomUUID method starts here",
        undefined,
        "getRandomUUID()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    return (
      Math.random().toString(36).substr(1, 12) + "_" + new Date().getTime()
    );
  },
  getFileName(files) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getFileName method starts here",
        { files },
        "getFileName()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    const temp = [];
    for (const file of files) {
      temp.push(file.name);
    }
    return temp;
  },
  getQueryParams(textUrl) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getQueryParams method starts here",
        { textUrl },
        "getQueryParams()",
        "ReactJsonSchemaFormUtil.js"
      )
    );
    const queryParamObject = {};
    if (textUrl.indexOf("?") === -1) return queryParamObject;
    const paramString = textUrl.split("?")[1];
    const paramsArr = paramString.split("&");
    for (let i = 0; i < paramsArr.length; i++) {
      const pair = paramsArr[i].split("=");
      if (pair && pair.length > 1 && pair[0] && pair[1]) {
        queryParamObject[pair[0]] = pair[1];
      }
    }
    return queryParamObject;
  },
};

export default ReactJsonSchemaUtil;
