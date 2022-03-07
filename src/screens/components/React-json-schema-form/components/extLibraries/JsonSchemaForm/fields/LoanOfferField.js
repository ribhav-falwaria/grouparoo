import React from "react";
import { useSelector } from "react-redux";
import LoanOffers from "../../../../../LoanOffers";
const LoanOffersWidget = (props) => {
  debugger;
  const loanAmount = useSelector((state) => state.formDetails.loanAmount);
  const onOfferSelected = (loanOffer) => {
    props.onChange(loanOffer);
  };
  return (
    <LoanOffers
      currentLoanAmount={loanAmount}
      onOfferSelected={onOfferSelected}
      selectedLoanOffer={props.formData}
    />
  );
};

export default LoanOffersWidget;
