import { AppStorage } from "../../services/app-storage.service";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const settings = {
  name: "settings",
  state: {
    language: "en",
    supportLanguages: {
      en: "English",
      hi: "Hindi",
      kn: "Kannada",
      ta: "Tamil",
      te: "Telugu",
      mr: "Marathi",
      bn: "Bengali",
    },
    isMobileValid: false,
    validatedMobileNumber: "",
    loanAppHelpShown: false,
  },
  selectors: {
    getLanguage: () => (rootState) => rootState.settings.language,
    getIsMobileValid: () => (rootState) => rootState.settings.isMobileValid,
    getValidMobileNumber: () => (rootState) =>
      rootState.settings.validatedMobileNumber,
    getIsApplicationHelpShown: () => (rootState) =>
      rootState.settings.loanAppHelpShown,
  },
  reducers: {
    setLanguage: (state, language) => {
      state.language = language;
      return state;
    },
    setIsMobileValid: (state, { isMobileValid, validatedMobileNumber }) => {
      state.isMobileValid = isMobileValid;
      state.validatedMobileNumber = validatedMobileNumber;
      return state;
    },
    setApplicationHelp: (state, loanAppHelpShown) => {
      state.loanAppHelpShown = loanAppHelpShown;
      return state;
    },
  },
  effects: (dispatch) => ({
    async setApplicationHelpShown(loanAppHelpShown, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " setApplicationHelpShown method starts here",
          { loanAppHelpShown, rootState },
          "setApplicationHelpShown()",
          "settings.js"
        )
      );
      await AppStorage.setLoanApplicationHelpShown(loanAppHelpShown);
      dispatch.settings.setApplicationHelp(loanAppHelpShown);
    },
    async loadLoanApplicationHelpShown(_, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " loadLoanApplicationHelpShown method starts here",
          { _, rootState },
          "loadLoanApplicationHelpShown()",
          "settings.js"
        )
      );
      const loanAppHelpShown = await AppStorage.getLoanApplicationHelpShown();
      dispatch.settings.setApplicationHelp(loanAppHelpShown);
    },
  }),
};

export default settings;
