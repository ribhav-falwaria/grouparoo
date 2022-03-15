import React, { memo, useContext } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import {
  TopNavigation,
  TopNavigationAction,
  StyleService,
  useStyleSheet,
  Icon,
} from "@ui-kitten/components";
import { BackHandler } from "react-native";
import isUndefined from "lodash.isundefined";
import ApplicationFormNative from "./ApplicationFormNative";
import { useRequest } from "ahooks";
import apiService from "../../apiService";
import LoadingSpinner from "../components/LoadingSpinner";
import { WarningIcon } from "../components/ThemedIcons";
import { LocalizationContext } from "../../components/Translation";
import SimpleModal from "../components/SimpleModal";
import LoanApplicationHelp from "./LoanApplicationHelp";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const createLoanApplication = async (
  dispatch,
  activeLoanApplications,
  currentLoanApplication
) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " createLoanApplication method starts here",
      { dispatch, activeLoanApplications, currentLoanApplication },
      "createLoanApplication()",
      "ApplicationForm.js"
    )
  );
  if (activeLoanApplications.length === 1) {
    await dispatch.loanApplications.setCurrentLoanApplication(
      activeLoanApplications[0].loanApplicationId
    );
  } else {
    const executionId =
      await apiService.appApi.loanApplication.createLoanApplicationId.execute();
    const loanApplicationId =
      await apiService.appApi.loanApplication.createLoanApplicationId.get(
        executionId
      );
    return dispatch.loanApplications.createLoanApplication({
      loanApplicationId,
    });
  }
};

const ApplicationForm = ({ navigation, route }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " ApplicationForm method starts here",
      { navigation, route },
      "ApplicationForm()",
      "ApplicationForm.js"
    )
  );
  const dispatch = useDispatch();
  const store = useStore();
  const styles = useStyleSheet(themedStyles);
  const state = useSelector((state) => state);
  const [visible, setVisible] = React.useState(false);
  const { translations } = useContext(LocalizationContext);

  const currentLoanApplication =
    store.select.loanApplications.getCurrentLoanApplication(state);
  const activeLoanApplications =
    store.select.loanApplications.getActiveLoanApplications(state);
  const isHelpShown = store.select.settings.getIsApplicationHelpShown(state);
  const createLoanApplicationRequest = useRequest(
    () =>
      createLoanApplication(
        dispatch,
        activeLoanApplications,
        currentLoanApplication
      ),
    {
      ready: isUndefined(currentLoanApplication),
    }
  );
  if (createLoanApplicationRequest.loading) {
    return <LoadingSpinner />;
  }
  if (createLoanApplicationRequest.error) {
    throw createLoanApplicationRequest.error;
  }
  const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const navigateBack = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " navigateBack method starts here",
        undefined,
        "navigateBack()",
        "ApplicationForm.js"
      )
    );
    // props.navigation.goBack()
  };
  const exitApp = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " exitApp method starts here",
        undefined,
        "exitApp()",
        "ApplicationForm.js"
      )
    );
    BackHandler.exitApp();
  };
  const onPress = () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " onPress method starts here",
        undefined,
        "onPress()",
        "ApplicationForm.js"
      )
    );
    dispatch.settings.setApplicationHelpShown(true);
  };
  if (!isUndefined(currentLoanApplication)) {
    return (
      <>
        <TopNavigation
          style={styles.topNavigationStyle}
          alignment="center"
          accessoryLeft={BackAction}
        />
        {!isHelpShown && <LoanApplicationHelp onPress={onPress} />}
        {isHelpShown && (
          <ApplicationFormNative
            currentLoanApplication={currentLoanApplication}
          />
        )}
        <SimpleModal
          visible={visible}
          okText={translations["modal.ok"]}
          cancelText={translations["modal.cancel"]}
          onCancel={() => setVisible(false)}
          onOk={exitApp}
          title={translations["applicationForm.exitConfirmation.title"]}
          description={
            translations["applicationForm.exitConfirmation.description"]
          }
          subTitle={translations["applicationForm.exitConfirmation.subTitle"]}
          Icon={WarningIcon}
        />
      </>
    );
  } else {
    throw new Error("NO_CURRENT_LOAN_APPLICATION");
  }
};
const themedStyles = StyleService.create({
  topNavigationStyle: {
    backgroundColor: "background-basic-color-1",
  },
});
export default ApplicationForm;
