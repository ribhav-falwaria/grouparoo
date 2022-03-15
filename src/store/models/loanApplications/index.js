import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import isUndefined from "lodash.isundefined";
import apiService from "../../../apiService";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";

const addLoanApplications = (state, { loanApplications }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " addLoanApplications method starts here",
      { loanApplications, state },
      "addLoanApplications()",
      "loanApplications.js"
    )
  );
  if (!isEmpty(loanApplications)) {
    const activeLoanApplicationIds = [];
    if (!isUndefined(loanApplications)) {
      loanApplications.forEach((la) => {
        state.applications[la.loanApplicationId] = la;
        if (la.status === "ACTIVE") {
          activeLoanApplicationIds.push(la.loanApplicationId);
        }
      });
      if (loanApplications.length === 1) {
        state.currentLoanApplicationId = loanApplications[0].loanApplicationId;
      }
      state.activeLoanApplicationIds = activeLoanApplicationIds;
      return state;
    }
    return state;
  }
  return state;
};
const loanApplications = {
  name: "loanApplications",
  state: {
    activeLoanApplicationIds: [],
    currentLoanApplicationId: undefined,
    applications: {},
  },
  selectors: {
    getCurrentLoanApplication: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getCurrentLoanApplication method starts here",
          { rootState },
          "getCurrentLoanApplication()",
          "loanApplications.js"
        )
      );
      const loanApplications = rootState.loanApplications;
      if (!isUndefined(loanApplications.currentLoanApplicationId)) {
        const loanApplication =
          loanApplications.applications[
            loanApplications.currentLoanApplicationId
          ];
        return loanApplication;
      }
    },
    hasAnyLoanApplication: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " hasAnyLoanApplication method starts here",
          { rootState },
          "hasAnyLoanApplication()",
          "loanApplications.js"
        )
      );
      return !isEmpty(rootState.loanApplications.applications);
    },
    getApplicationById:
      (select) =>
      (rootState, { id }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getApplicationById method starts here",
            { rootState, id },
            "getApplicationById()",
            "loanApplications.js"
          )
        );
        const loanApplication = rootState.loanApplications.applications[id];
        return loanApplication;
      },
    getActiveLoanApplications: (select) => (rootState) => {
      const activeLoanApplicationIds =
        rootState.loanApplications.activeLoanApplicationIds;
      return activeLoanApplicationIds.map(
        (aid) => rootState.loanApplications.applications[aid]
      );
    },
    getAllLoanApplications: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAllLoanApplications method starts here",
          { rootState },
          "getAllLoanApplications()",
          "loanApplications.js"
        )
      );
      return Object.keys(rootState.loanApplications.applications).map(
        (ky) => rootState.loanApplications.applications[ky]
      );
    },
    getLoanAmount:
      (select) =>
      (rootState, { loanApplicationId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanAmount method starts here",
            { rootState, loanApplicationId },
            "getLoanAmount()",
            "loanApplications.js"
          )
        );
        return rootState.loanApplications.applications[loanApplicationId]
          .loanAmount;
      },
    getStartDate:
      (select) =>
      (rootState, { loanApplicationId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getStartDate method starts here",
            { rootState, loanApplicationId },
            "getStartDate()",
            "loanApplications.js"
          )
        );
        const createdAt =
          rootState.loanApplications.applications[loanApplicationId].createdOn;
        return dayjs(createdAt).format("DD-MMM-YYYY");
      },
    getLoanDetailsForApplication:
      (select) =>
      (rootState, { loanApplicationId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanDetailsForApplication method starts here",
            { rootState, loanApplicationId },
            "getLoanDetailsForApplication()",
            "loanApplications.js"
          )
        );
        const loanApplication =
          rootState.loanApplications.application[loanApplicationId];
        const loan = select.loans.getLoanById({
          loanApplicationId: loanApplication.loanApplicationId,
        });
        return loan;
      },
  },
  reducers: {
    // Called only while registering or signing in. Server has the true data
    "customer/setCustomer": addLoanApplications,
    addLoanApplication: (state, { loanApplication }) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " addLoanApplication method starts here",
          { state, loanApplication },
          "addLoanApplication()",
          "loanApplications.js"
        )
      );
      if (loanApplication.status === "active") {
        state.activeLoanApplicationIds = [
          loanApplication.loanApplicationId,
          ...state.activeLoanApplicationIds,
        ];
        if (isEmpty(state.applications)) {
          // This is the first application
          state.currentLoanApplicationId = loanApplication.loanApplicationId;
        }
      }
      state.applications[loanApplication.loanApplicationId] = loanApplication;
      return state;
    },
    setCurrentLoanApplication: (state, loanApplicationId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setCurrentLoanApplication method starts here",
          { state, loanApplicationId },
          "setCurrentLoanApplication()",
          "loanApplications.js"
        )
      );
      state.currentLoanApplicationId = loanApplicationId;
      const newState = Object.assign({}, state);
      return newState;
    },
    "loans/addAllLoans": (state, { allLoans }) => {
      if (isUndefined(allLoans)) {
        return state;
      }
      allLoans.forEach((al) => {
        const loanApp = state.applications[al.loanApplicationId];
        if (loanApp) {
          loanApp.loanId = al.externalLoanId;
        }
      });
      return state;
    },
  },
  effects: (dispatch) => ({
    async createLoanApplication({ loanApplicationId }, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " createLoanApplication method starts here",
          { rootState, loanApplicationId },
          "createLoanApplication()",
          "loanApplications.js"
        )
      );
      const { id, customerDetails } = rootState.customer;
      const formData = {
        primaryName: customerDetails.fullName,
        // primaryEmail: customerDetails.primaryEmail,
        primaryPhone: customerDetails.primaryPhone,
        isPrimaryPhoneVerified: "yes",
        loanApplicationId,
        status: "ACTIVE",
        customerId: customerDetails.$id,
      };
      try {
        const loanApplication = await apiService.appApi.loanApplication.create(
          formData,
          id
        );
        dispatch.loanApplications.addLoanApplication({ loanApplication });
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            undefined,
            "createLoanApplication()",
            "loanApplications.js"
          )
        );
        console.log(e);
        throw new Error("CANNOT_CREATE_LOAN_APPLICATION");
      }
    },
    async removeLoanApplication({ loanApplicationId }, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " removeLoanApplication method starts here",
          { rootState, loanApplicationId },
          "removeLoanApplication()",
          "loanApplications.js"
        )
      );
      const loanApplication = rootState.loanApplications[loanApplicationId];
      if (!isUndefined(loanApplication)) {
        await apiService.appApi.loans.deleteLoanApplication(rootState);
        dispatch.loanApplications.deleteLoanApplication({ loanApplicationId });
      }
    },
  }),
};
export default loanApplications;
