import React from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import LoanApplicationList from "./LoanApplicationList";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const ManageLoanApplications = ({ navigation, route }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "ManageLoanApplications method starts here",
      { navigation, route },
      "ManageLoanApplications()",
      "index.js"
    )
  );
  const store = useStore();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const activeLoanApplications =
    store.select.loanApplications.getActiveLoanApplications(state);
  const onEditLoanApplication = async (loanApplicationId) => {
    await dispatch.loanApplications.setCurrentLoanApplication(
      loanApplicationId
    );
    navigation.navigate("ApplicationForm");
  };

  return (
    <LoanApplicationList
      activeLoanApplications={activeLoanApplications}
      onEditLoanApplication={onEditLoanApplication}
    />
  );
};

export default ManageLoanApplications;
