import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../Errors/ErrorUtil";
const formDetails = {
  name: "formDetails",
  state: {
    formData: {},
    schema: {},
    uiSchema: {},
    steps: {},
    currentStepNumber: 1,
    verifiedPhoneNumber: "",
    verifiedGstNumber: "",
    isGSTVerified: "",
    isPrimaryPhoneVerified: "",
    isPanVerified: "",
    isUdyamVerified: "",
    isBankStatementVerified: "",
    panFile: undefined,
    bankStatementFiles: [],
    aadharFrontFile: undefined,
    aadharBackFile: undefined,
    okycSelfieFile: undefined,
    selfieFile: undefined,
    loanAmount: undefined,
    itrFiles: [],
    // Adapter Response
    panData: {},
    gstnData: {},
    udyamData: {},
    kycData: {},
    // tempId for application
    tempId: String(Math.floor(100000 + Math.random() * 900000)),
  },
  selectors: {
    getPanFile: (select) => (rootState) => rootState.formDetails.panFile,
    // give a copy of the state
    getBankStatementFiles: (select) => (rootState) =>
      rootState.formDetails.bankStatementFiles,
    getItrFiles: (select) => (rootState) => rootState.formDetails.itrFiles,
  },
  reducers: {
    setSchemaDetails: (state, { schema, uiSchema, steps, formData }) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setSchemaDetails method starts here",
          { schema, uiSchema, steps, formData, state },
          "setSchemaDetails()",
          "formDetails.js"
        )
      );
      state.schema = schema;
      state.uiSchema = uiSchema;
      state.steps = steps;
      state.formData = formData;
      return state;
    },
    setLoanAmount: (state, loanAmount) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setLoanAmount method starts here",
          { schema, uiSchema, steps, formData, state },
          "setLoanAmount()",
          "formDetails.js"
        )
      );
      state.loanAmount = loanAmount;
      return state;
    },
    setItrFiles: (state, files) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setItrFiles method starts here",
          { state, files },
          "setItrFiles()",
          "formDetails.js"
        )
      );
      state.itrFiles = files;
      return state;
    },
    removeItrFiles: (state, removeFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " removeItrFiles method starts here",
          { state, removeFile },
          "removeItrFiles()",
          "formDetails.js"
        )
      );
      const newStatements = state.itrFiles.filter(
        (f) => f.uri !== removeFile.uri
      );
      state.itrFiles = [...newStatements];
      return state;
    },
    setIsBankStatementVerified: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setIsBankStatementVerified method starts here",
          { state, payload },
          "setIsBankStatementVerified()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        isBankStatementVerified: payload,
      };
    },
    setIsUdyamVerified: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setIsUdyamVerified method starts here",
          { state, payload },
          "setIsUdyamVerified()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        isUdyamVerified: payload,
      };
    },
    setSelfieFile: (state, selfieFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setSelfieFile method starts here",
          { state, selfieFile },
          "setSelfieFile()",
          "formDetails.js"
        )
      );
      state.selfieFile = selfieFile;
      return state;
    },
    setIsPanVerified: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setIsPanVerified method starts here",
          { state, payload },
          "setIsPanVerified()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        isPanVerified: payload,
      };
    },
    setIsPrimaryPhoneVerified: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setIsPrimaryPhoneVerified method starts here",
          { state, payload },
          "setIsPrimaryPhoneVerified()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        isPrimaryPhoneVerified: payload,
      };
    },
    setverifiedPhoneNumber: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setverifiedPhoneNumber method starts here",
          { state, payload },
          "setverifiedPhoneNumber()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        verifiedPhoneNumber: payload,
      };
    },
    setverifiedGstNumber: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setverifiedGstNumber method starts here",
          { state, payload },
          "setverifiedGstNumber()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        verifiedGstNumber: payload,
      };
    },
    setIsGSTVerified: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setIsGSTVerified method starts here",
          { state, payload },
          "setIsGSTVerified()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        isGSTVerified: payload,
      };
    },
    setOkycSelfieFile: (state, okycSelfieFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setOkycSelfieFile method starts here",
          { state, okycSelfieFile },
          "setOkycSelfieFile()",
          "formDetails.js"
        )
      );
      state.okycSelfieFile = okycSelfieFile;
      return state;
    },
    setPanFile: (state, panFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setPanFile method starts here",
          { state, panFile },
          "setPanFile()",
          "formDetails.js"
        )
      );
      state.panFile = panFile;
      return state;
    },
    setBankStatementFiles: (state, bankStatementFiles) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setBankStatementFiles method starts here",
          { state, bankStatementFiles },
          "setBankStatementFiles()",
          "formDetails.js"
        )
      );
      state.bankStatementFiles = [
        ...state.bankStatementFiles,
        ...bankStatementFiles,
      ];
      return state;
    },
    removeFromBankStatementFiles: (state, removeFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " removeFromBankStatementFiles method starts here",
          { state, removeFile },
          "removeFromBankStatementFiles()",
          "formDetails.js"
        )
      );
      const newStatements = state.bankStatementFiles.filter(
        (f) => f.uri !== removeFile.uri
      );
      state.bankStatementFiles = [...newStatements];
      return state;
    },
    setAadharFrontFile: (state, aadharFrontFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setAadharFrontFile method starts here",
          { state, aadharFrontFile },
          "setAadharFrontFile()",
          "formDetails.js"
        )
      );
      state.aadharFrontFile = aadharFrontFile;
      return state;
    },
    setAadharBackFile: (state, aadharBackFile) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setAadharBackFile method starts here",
          { state, aadharBackFile },
          "setAadharBackFile()",
          "formDetails.js"
        )
      );
      state.aadharBackFile = aadharBackFile;
      return state;
    },
    setFormData: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setFormData method starts here",
          { state, payload },
          "setFormData()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        formData: payload,
      };
    },
    setSchema: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setSchema method starts here",
          { state, payload },
          "setSchema()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        schema: payload,
      };
    },
    setUiSchema: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setUiSchema method starts here",
          { state, payload },
          "setUiSchema()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        uiSchema: payload,
      };
    },
    setStep: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setStep method starts here",
          { state, payload },
          "setStep()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        step: payload,
      };
    },
    setPanData: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setPanData method starts here",
          { state, payload },
          "setPanData()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        panData: payload,
      };
    },
    setGstnData: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setGstnData method starts here",
          { state, payload },
          "setGstnData()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        gstnData: payload,
      };
    },
    setUdyamData: (state, payload) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setUdyamData method starts here",
          { state, payload },
          "setUdyamData()",
          "formDetails.js"
        )
      );
      return {
        ...state,
        udyamData: payload,
      };
    },
    setaadharData: (state, { kycData, kycMatchData }) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setaadharData method starts here",
          { state, kycData, kycMatchData },
          "setaadharData()",
          "formDetails.js"
        )
      );
      state.kycData = kycData;
      state.kycMatchData = kycMatchData;
      return state;
    },
  },
};
export default formDetails;
