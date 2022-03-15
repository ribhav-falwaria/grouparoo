import orderBy from "lodash.orderby";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const loanApplicationSteps = {
  name: "loanApplicationSteps",
  state: [
    {
      order: 0,
      title: "application.form.title",
      completeTitle: "application.form.complete",
      action: "application.form.action",
    },
    {
      order: 1,
      title: "application.cpv.title",
      completeTitle: "application.cpv.complete",
      action: "application.cpv.action",
    },
    {
      order: 2,
      title: "application.applicationForm.title",
      completeTitle: "application.applicationForm.complete",
      action: "application.kyc.action",
    },
    {
      order: 3,
      title: "application.disbursement.title",
      completeTitle: "application.disbursement.complete",
      action: "application.disbursement.action",
    },
  ],
  selectors: {
    getLoanApplicationSteps: () => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getLoanApplicationSteps method starts here",
          { rootState },
          "getLoanApplicationSteps()",
          "loanApplicationSteps.js"
        )
      );
      return orderBy(rootState.loanApplicationSteps, ["order"], ["asc"]);
    },
    getCurrentStep:
      (select) =>
      (rootState, { loanApplicationId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getCurrentStep method starts here",
            { rootState, loanApplicationId },
            "getCurrentStep()",
            "loanApplicationSteps.js"
          )
        );
        return {
          step: loanApplicationSteps[2],
          index: 2,
        };
      },
  },
  effects: {},
  reducers: {},
};
export default loanApplicationSteps;
