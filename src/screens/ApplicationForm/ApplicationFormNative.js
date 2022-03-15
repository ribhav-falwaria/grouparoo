import React from "react";
import isUndefined from "lodash.isundefined";
import { View } from "react-native";
import { connect } from "react-redux";
import { withStyles } from "@ui-kitten/components";
import store from "../../store";
import JsonSchemaForm from "../components/React-json-schema-form";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

class ApplicationFormNative extends React.PureComponent {
  async componentDidMount() {
    if (isUndefined(this.props.jwt)) {
      try {
        await this.props.getCustomerJwt();
      } catch (err) {
        console.log(err);
        console.log("CANNOT_GET_JWT");
      }
    }
  }

  render() {
    const { currentLoanApplication, borrowingEntity, jwt } = this.props;
    const {
      eva: { style },
    } = this.props;
    return (
      <View style={style.container}>
        <JsonSchemaForm
          currentFormData={currentLoanApplication}
          formId={borrowingEntity.loanAssessmentFormId}
          stepSchemaName={borrowingEntity.stepsAssessmentMobile}
          token={jwt}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " mapStateToProps method starts here",
      { state },
      "mapStateToProps()",
      "ApplicationFormNative.js"
    )
  );
  const loanTypes = store.select.loanTypes.getLoanTypes(state);
  const defaultLoanType = store.select.loanTypes.getDefaultLoanType(state);
  const borrowingEntity =
    store.select.borrowingEntities.getBorrowingEntity(state);
  const jwt = store.select.customer.getJwt(state);
  return {
    loanTypes,
    defaultLoanType,
    jwt,
    borrowingEntity,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getCustomerJwt: () => dispatch.customer.getCustomerJwt(),
});
const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationFormNative);
export default withStyles(Component, (themes) => ({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
}));
