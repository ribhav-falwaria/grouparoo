/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten customermobileapp
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React, { useContext } from "react";
import SplashScreen from "react-native-splash-screen";
import { connect } from "react-redux";
import store from "./store";
import AppNavigation from "./navigation/App.Navigation";
import { LocalizationContext } from "./components/Translation";
import ToastComponent from "./screens/components/ToastComponent";
import crashlytics from "@react-native-firebase/crashlytics";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../src/screens/Errors/ErrorUtil";
/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

class MainApp extends React.Component {
  static contextType = LocalizationContext;
  state = {
    userChecked: false,
  };
  async componentDidMount() {
    await this.props.checkAndAuthenticateUser();
    this.setState({ userChecked: true });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.isLoggedIn === this.props.isLoggedIn &&
      nextProps.isPermissionsRequested === this.props.isPermissionsRequested &&
      nextProps.isFirstTime === this.props.isFirstTime &&
      nextProps.hasActiveLoan === this.props.hasActiveLoan &&
      nextProps.isAllPermissionsValid === this.props.isPermissionsRequested &&
      nextProps.loading === this.props.isPermissionsRequested
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { userChecked } = this.state;
    this.context.initializeAppLanguage();
    const {
      isLoggedIn,
      isPermissionsRequested,
      isFirstTime,
      hasActiveLoan,
      isAllPermissionsValid,
      loading,
    } = this.props;
    return (
      <>
        <AppNavigation
          loading={loading || !userChecked}
          isLoggedIn={isLoggedIn}
          isPermissionsRequested={isPermissionsRequested}
          isFirstTime={isFirstTime}
          isAllPermissionsValid={isAllPermissionsValid}
          hasActiveLoan={hasActiveLoan}
        />
        <ToastComponent />
      </>
    );
  }
}

const mapStateToProps = (state, props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " mapStateToProps method starts here",
      { state, props },
      "mapStateToProps()",
      "MainApp.js"
    )
  );
  const selection = store.select((models) => ({
    isLoggedIn: models.authentication.isUserLoggedIn,
    hasActiveLoan: models.loans.hasActiveLoan,
    isFirstTime: models.authentication.isFirstTime,
    isPermissionsRequested: models.permissionsHelp.getIsPermissionsRequested,
    isAllPermissionsValid: models.permissionsHelp.allPermissionsValid,
  }));
  const loading =
    state.loading.models.permissionsHelp ||
    state.loading.models.authentication ||
    props.loading;
  const loggedinCustomerId = state?.customer?.customerDetails?.$id;
  crashlytics().setUserId(
    loggedinCustomerId ? loggedinCustomerId : "(Not Logged In)"
  );
  return {
    ...selection(state),
    loading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  checkAndAuthenticateUser: async () => {
    crashlytics().log(
      ErrorUtil.createLog(
        " checkAndAuthenticateUser method starts here",
        undefined,
        "checkAndAuthenticateUser()",
        "MainApp.js"
      )
    );
    await Promise.all([
      dispatch.authentication.checkAndAuthenticateUser(),
      dispatch.permissionsHelp.checkRequiredPermissions(),
      dispatch.settings.loadLoanApplicationHelpShown(),
    ]);

    SplashScreen.hide();
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
