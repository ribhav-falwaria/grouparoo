import apiService from "../../apiService";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const loanTypes = {
  name: "loanTypes",
  state: [],
  selectors: {
    getDisplayName:
      (select) =>
      (rootState, { loanTypeId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getDisplayName method starts here",
            { loanTypeId, rootState },
            "getDisplayName()",
            "loanTypes.js"
          )
        );
        return rootState.loanTypes[loanTypeId].name;
      },
    getLoanTypes: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getLoanTypes method starts here",
          { rootState },
          "getLoanTypes()",
          "loanTypes.js"
        )
      );
      const loanTypes = rootState.loanTypes;
      return loanTypes;
    },
    getDefaultLoanType: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getDefaultLoanType method starts here",
          { rootState },
          "getDefaultLoanType()",
          "loanTypes.js"
        )
      );
      return rootState.loanTypes.defaultLoanType;
    },
    getLoanTypeForApplicationId:
      (select) =>
      (rootState, { loanApplicationId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanTypeForApplicationId method starts here",
            { rootState, loanApplicationId },
            "getLoanTypeForApplicationId()",
            "loanTypes.js"
          )
        );
        const loanApplication = select.loanApplications.getById(
          rootState,
          loanApplicationId
        );
        if (loanApplication && loanApplication.loanType) {
          return rootState.loanTypes[loanApplication.loanType];
        } else {
          return {};
        }
      },
  },
  reducers: {
    setLoanTypes: (state, { loanTypes }) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setLoanTypes method starts here",
          { state, loanTypes },
          "setLoanTypes()",
          "loanTypes.js"
        )
      );
      loanTypes.forEach((lt) => {
        if (lt.active) {
          state[lt.productType] = lt;
          if (lt.default) {
            state.defaultLoanType = lt;
          }
        }
      });
      return state;
    },
  },
  effects: (dispatch) => ({
    async getAllLoanTypes(_, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAllLoanTypes method starts here",
          { _, rootState },
          "getAllLoanTypes()",
          "loanTypes.js"
        )
      );
      const loanTypes = await apiService.appApi.loanTypes.getAll();
      dispatch.loanTypes.setLoanTypes({ loanTypes });
    },
  }),
};
export default loanTypes;
