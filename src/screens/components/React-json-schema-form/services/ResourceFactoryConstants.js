import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../Errors/ErrorUtil";
class ResourceFactoryConstants {
  apiContextPath = "/novocode/";
  brokerContextPath = "/broker/";
  udyamContextPath = "/udyam?udyam=";
  defaultApiContextPath = "/";
  documentGatewayURL = "/api-gateway/document/v1/";
  platformApiGatewayURL = "/api-gateway/api/v1/";
  voyagerContext = "voyager/";
  apiGateWay = "https://dev-codeapp.novopay.in";
  adapterServiceUrl = "https://novo-adapter-qa.novopay.in/";
  appWriteUrl = "https://dev-appwrite.novopay.in/v1/";
  qaGateWay = "https://novo-adapter-qa.novopay.in/";
  REACT_APP_DMS_SERVER_URL = "https://asset-qa-platform.novopay.in";
  REACT_APP_SPRING_VERIFY_SERVER_URL =
    "https://api-dev.springscan.springverify.com/";
  REACT_APP_AADHAR_PAN_SERVICE =
    "https://sandbox.veri5digital.com/verification-service/api/1.0/";
  constants = {
    masterData: {
      getStates: this.getPlatformApiUrl("getChildHierarchyElements"),
      getCountries: this.getPlatformApiUrl("getDatatypeMaster"),
    },
    enach: {
      createPlan: this.getCustomUrl(
        this.adapterServiceUrl,
        "payment/createPlan",
        ""
      ),
      createSubscription: this.getCustomUrl(
        this.adapterServiceUrl,
        "payment/createSubscription",
        ""
      ),
    },
    forms: {
      getSchemaAndStepsByName: this.getApiUrl("getSchemaAndStepsByName"),
      saveActionForm: this.getCustomUrl(
        this.apiGateWay,
        "sendApplicationForm",
        this.brokerContextPath
      ),
      getEsignConfimationUrl: this.getCustomUrl(
        this.adapterServiceUrl,
        "message",
        this.voyagerContext
      ),
    },
    document: {
      uploadDocument: this.getDocumentApiUrl("uploadDocument"),
      downloadDocument: this.getDocumentApiUrl("downloadDocument"),
      uploadPan: this.getSpringVerifyApiUrl("user/person/upload/"),
    },
    aadhar: {
      verifyAadharNumber: this.getAadharPanServiceUrl("verifyUserIdDoc"),
    },
    pan: {
      verifyPanNumber: this.getAadharPanServiceUrl("verifyUserIdDoc"),
      verifyPanNumberV1: this.getApiUrlV1("verify/panNumber?pan_number="),
      verfifyPanOcr: this.getApiUrlV1("verify/doc/upload?doc_type=PAN"),
      getGSTDataFromPAN: this.getCustomUrl(
        this.adapterServiceUrl,
        "v1/api/pan/gst",
        ""
      ),
    },
    gstin: {
      verifyGstin: this.getCustomUrl(
        this.adapterServiceUrl,
        "verify/gst?gstin=",
        ""
      ),
    },
    udyam: {
      verifyUdyamAadhar: this.getCustomUrl(
        this.apiGateWay,
        this.udyamContextPath,
        "/verify"
      ),
    },
    eSign: {
      uploadPdfForeSign: this.getApiUrlV1("verify/esign/uploadPdf"),
      signedPdfToSaveInDB: this.getApiUrlV1("verify/esign/success"),
    },
    otp: {
      generateOTP: this.getApiUrlV1("sendOtp"),
      validateOTP: this.getApiUrlV1("validateOtp"),
    },
    kyc: {
      getUrlForCaptcha: this.getCustomUrl(
        this.apiGateWay,
        "getCaptcha",
        "/okyc/"
      ),
      getUrlForReCaptcha: this.getCustomUrl(
        this.apiGateWay,
        "getReCaptcha",
        "/okyc/"
      ),
      getUrlToGenerateOTP: this.getCustomUrl(
        this.apiGateWay,
        "enterAadhaar",
        "/okyc/"
      ),
      getUrlToFetchKyc: this.getCustomUrl(
        this.apiGateWay,
        "enterOtp",
        "/okyc/"
      ),
      getUrlForIdMatch: this.qaGateWay + "match",
      getUrlForFaceMatch: this.getCustomUrl(
        this.apiGateWay,
        "faceMatch",
        "/okyc/"
      ),
    },
    cibil: {
      sendOTPForCibil: this.getCustomUrl(
        this.adapterServiceUrl,
        "",
        "credit-service/credit/sendOtp"
      ),
      verifyCibilOtp: this.getCustomUrl(
        this.adapterServiceUrl,
        "",
        "credit-service/credit/fetchCibilXml"
      ),
    },
    bankStatement: {
      uploadBankStatement: this.getCustomUrl(
        "https://novo-adapter-qa.novopay.in/",
        "",
        "v1/api/bankstatement"
      ),
    },
    aadharMask: {
      uploadAadharWithFronAndBack: this.getCustomUrl(
        this.apiGateWay,
        "mask",
        "/aadhaar/"
      ),
    },
    exists: {
      pincode: this.getCustomUrl(
        this.adapterServiceUrl,
        "",
        "v1/api/pincode/exists"
      ),
      imageQuality: this.getCustomUrl(
        this.adapterServiceUrl,
        "",
        "image/qualityCheck"
      ),
    },
    lending: {
      uploadFile: this.getCustomUrl(this.apiGateWay, "upload", "/lending/"),
      downloadFile: this.getCustomUrl(
        this.apiGateWay,
        "download?id=",
        "/lending/"
      ),
    },
    finbox: {
      getSessionAPI: "https://portal.finbox.in/bank-connect/v1/session/",
    },
  };

  getApiUrl(apiName) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getApiUrl method starts here",
        { apiName },
        "getApiUrl()",
        "ResourceFactoryConstants.js"
      )
    );
    return this.apiGateWay + this.apiContextPath + apiName;
  }
  getApiUrlV1(apiName) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getApiUrlV1 method starts here",
        { apiName },
        "getApiUrlV1()",
        "ResourceFactoryConstants.js"
      )
    );
    return this.apiGateWay + this.defaultApiContextPath + apiName;
  }
  getCustomUrl(apiGateway, apiName, contextPath) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getCustomUrl method starts here",
        { apiGateway, apiName, contextPath },
        "getCustomUrl()",
        "ResourceFactoryConstants.js"
      )
    );
    return apiGateway + contextPath + apiName;
  }
  getDocumentApiUrl(apiName) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getDocumentApiUrl method starts here",
        { apiName },
        "getDocumentApiUrl()",
        "ResourceFactoryConstants.js"
      )
    );
    return (
      this.REACT_APP_DMS_SERVER_URL + `${this.documentGatewayURL}` + apiName
    );
  }
  getPlatformApiUrl(apiName) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getPlatformApiUrl method starts here",
        { apiName },
        "getPlatformApiUrl()",
        "ResourceFactoryConstants.js"
      )
    );
    return (
      this.REACT_APP_DMS_SERVER_URL + `${this.platformApiGatewayURL}` + apiName
    );
  }
  getSpringVerifyApiUrl(apiName) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getSpringVerifyApiUrl method starts here",
        { apiName },
        "getSpringVerifyApiUrl()",
        "ResourceFactoryConstants.js"
      )
    );
    return this.REACT_APP_SPRING_VERIFY_SERVER_URL + apiName;
  }

  getAadharPanServiceUrl(apiName) {
    crashlytics().log(
      ErrorUtil.createLog(
        " getAadharPanServiceUrl method starts here",
        { apiName },
        "getAadharPanServiceUrl()",
        "ResourceFactoryConstants.js"
      )
    );
    return this.REACT_APP_AADHAR_PAN_SERVICE + apiName;
  }
}

export default ResourceFactoryConstants;
