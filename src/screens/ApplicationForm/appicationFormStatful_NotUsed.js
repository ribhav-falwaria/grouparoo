import React, { Component, useState } from "react";
import store from "../../store";
import { View } from "react-native";
import isEmpty from "lodash.isempty";
import { useStore, useSelector, useDispatch, connect } from "react-redux";
import { useRequest } from "ahooks";
import { StyleService, useStyleSheet } from "@ui-kitten/components";
import LoadingSpinner from "../components/LoadingSpinner";
import JsonSchemaMultiStepForm from "../components/JsonSchemaForm/JsonSchemaMultiStepForm";
import styleConstants from "../styleConstants";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

class ApplicationFrom extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.loanApplicationForm();
  }
}

const mapStateToProps = (state, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " mapStateToProps method starts here",
      { state, props },
      "mapStateToProps()",
      "appicationFormStatful_NotUsed.js"
    )
  );
  const currentLoanAppId = route.params.currentLoanAppId;
  const selection = store.select((models) => ({
    defaultLoanType: models.loanTypes.getDefaultLoanType,
    customer: models.customer.getCustomer,
    loanType: models.loanTypes.getLoanTypeForApplicationId,
    loanApplication: models.loanApplications.getById,
  }));
  const { defaultLoanType, customer, loanType, loanApplication } = selection(
    state,
    {
      loanApplicationId,
      id: loanApplicationId,
    }
  );
  const currentLoanType = isEmpty(loanType) ? defaultLoanType : loanType;
  const applicationForm = store.select.applicationForms.getById(
    state,
    currentLoanType.formName
  );
  return {
    loanType: currentLoanType,
    applicationForm,
    customer,
    loanApplication,
  };
};
const mapDispatchToProps = (dpspatch) => ({
  loadApplicationForm: (data) => dispatch.applicationForms.getAsyncById(data),
  createLoanApplication: (data) => dispatch.loanApplications.createAsync(data),
  updateLoanApplication: (data) => dispatch.loanApplications.updateAsync(data),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationForm);
