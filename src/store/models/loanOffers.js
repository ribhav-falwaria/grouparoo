import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
import apiService from "../../apiService";
const loanOffers = {
  name: "loanOffers",
  state: {},
  selectors: {
    getAllOffers: (select) => (rootState, loanApplicationId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAllOffers method starts here",
          { rootState, loanApplicationId },
          "getAllOffers()",
          "loanOffers.js"
        )
      );
      return rootState.loanOffers[loanApplicationId];
    },
  },
  reducers: {
    setLoanOffers: (state, { loanOffers, loanApplicationId }) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setLoanOffers method starts here",
          { rootState, loanApplicationId, loanOffers },
          "setLoanOffers()",
          "loanOffers.js"
        )
      );
      state[loanApplicationId] = loanOffers;
    },
  },
  effects: (dispatch) => ({
    async getOffersForApplication({ loanApplicationId }, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " getOffersForApplication method starts here",
          { rootState, loanApplicationId },
          "getOffersForApplication()",
          "loanOffers.js"
        )
      );
      try {
        const executionId =
          await apiService.appApi.loanApplication.getAllOffers.execute(
            loanApplicationId
          );
        const products =
          await apiService.appApi.loanApplication.getAllOffers.get(executionId);
        dispatch.loanOffers.setLoanOffers({ products });
      } catch (err) {
        crashlytics().log(
          ErrorUtil.createError(
            err,
            err.message,
            err.message,
            { rootState, loanApplicationId },
            "getOffersForApplication()",
            "loanOffers.js"
          )
        );
        throw new Error(err.message);
      }
    },
  }),
};

export default loanOffers;
