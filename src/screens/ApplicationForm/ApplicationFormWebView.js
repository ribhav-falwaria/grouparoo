import React from "react";
import { View } from "react-native";
import { useRequest } from "ahooks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleService, useStyleSheet } from "@ui-kitten/components";
import JsonSchemaFormWebView from "../components/JsonSchemaForm/JsonSchemaFormWebView";
import { config } from "../../config";
import apiService from "../../apiService";
import LoadingSpinner from "../components/LoadingSpinner";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";

const getJwt = async () => {
  crashlytics().log(
    ErrorUtil.createLog(
      " getJwt method starts here",
      undefined,
      "getJwt()",
      "ApplicationFormWebView.js"
    )
  );
  const { jwt } = await apiService.appApi.user.getJwtToken();
  return { jwt };
};

const ApplicationFormWebView = ({ currentLoanApplication }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " ApplicationFormWebView method starts here",
      { currentLoanApplication },
      "ApplicationFormWebView()",
      "ApplicationFormWebView.js"
    )
  );
  const styles = useStyleSheet(themedStyles);
  const { loanApplicationId } = currentLoanApplication;
  const { data, loading } = useRequest(getJwt);
  if (loading) {
    return <LoadingSpinner />;
  }
  const uri = `${config.loanApplicationWebView}&token=${data.jwt}&loanApplicationId=${loanApplicationId}`;
  return (
    <KeyboardAwareScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <JsonSchemaFormWebView uri={uri} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
export default ApplicationFormWebView;
