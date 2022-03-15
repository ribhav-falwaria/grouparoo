import React from "react";
import { useSelector } from "react-redux";
import LoanOffers from "../../../../../LoanOffers";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
const LoanOffersWidget = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "LoanOffersWidget method starts here ",
      { props },
      "LoanOffersWidget()",
      "LoanOffersWidget.js"
    )
  );
  const loanAmount = useSelector((state) => state.formDetails.loanAmount);
  const onOfferSelected = (loanOffer) => {
    props.onChange(loanOffer);
  };
  return (
    <LoanOffers
      currentLoanAmount={loanAmount}
      onOfferSelected={onOfferSelected}
      selectedLoanOffer={props.value}
    />
  );
};

export default LoanOffersWidget;
