import orderBy from "lodash.orderby";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const homeListItems = {
  name: "homeListItems",
  state: [
    {
      order: 2,
      name: "MyLoans",
      component: "MyLoansCard",
      icon: "MyLoansIcon",
      heading: "myLoans.cardTitle",
      content: "myLoans.content",
      navigate: "Loans",
    },
    {
      order: 4,
      name: "PendingApplications",
      component: "PendingLoanApplications",
      icon: "ApplicationFormIcon",
      heading: "pendingLoanApplication.title",
      content: "pendingLoanApplication.content",
      navigate: "ApplicationsList",
    },
    {
      order: 1,
      name: "RepaymentsPending",
      component: "RepaymentCard",
      icon: "RepaymentIcon",
      heading: "repayment.overdueTitle",
      content: "repayment.content",
      navigate: "Repayments",
    },
    {
      order: 3,
      name: "NextEmi",
      component: "NextEmiCard",
      icon: "RepaymentIcon",
      heading: "repayment.upcomingRepayment",
      content: "repayment.nextEmiContent",
      navigate: "Loans",
    },
    {
      order: 5,
      name: "Offers",
      component: "HorizontalListOffer",
    },
  ],
  selectors: {
    getHomeListItems: () => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getHomeListItems method starts here",
          undefined,
          "getHomeListItems()",
          "homeListItems.js"
        )
      );
      return orderBy(rootState.homeListItems, ["order"], ["asc"]);
    },
  },
};
export default homeListItems;
