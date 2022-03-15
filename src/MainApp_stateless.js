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
import { useRequest } from "ahooks";
import SplashScreen from "react-native-splash-screen";
import { useSelector, useStore, useDispatch } from "react-redux";

import AppNavigation from "./navigation/App.Navigation";
import { LocalizationContext } from "./components/Translation";
import { AppStorage } from "./services/app-storage.service";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../src/screens/Errors/ErrorUtil";

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
const checkAndAuthenticateUser = async (dispatch) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " checkAndAuthenticateUser method starts here",
      { dispatch },
      "checkAndAuthenticateUser()",
      "MainApp_stateless.js"
    )
  );
  await Promise.all([
    AppStorage.toggleFirstTime(),
    AppStorage.togglePermissionRequested(),
    AppStorage.toggleIntroScreen(),
    dispatch.authentication.checkAndAuthenticateUser(),
    dispatch.permissionsHelp.checkRequiredPermissions(),
  ]);
  SplashScreen.hide();
};
const MainApp = ({ props }) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " MainApp method starts here",
      { props },
      "MainApp()",
      "MainApp_stateless.js"
    )
  );
  const state = useSelector((state) => state);
  const store = useStore();
  const dispatch = useDispatch();
  const selection = store.select((models) => ({
    isLoggedIn: models.authentication.isUserLoggedIn,
    hasActiveLoan: models.loans.hasActiveLoan,
    isFirstTime: models.authentication.isFirstTime,
    isPermissionsRequested: models.permissionsHelp.getIsPermissionsRequested,
    isAllPermissionsValid: models.permissionsHelp.allPermissionsValid,
  }));
  const {
    isLoggedIn,
    isPermissionsRequested,
    isFirstTime,
    hasActiveLoan,
    isAllPermissionsValid,
  } = selection(state);
  const { initializeAppLanguage } = useContext(LocalizationContext);
  initializeAppLanguage();
  const { loading } = useRequest(() => checkAndAuthenticateUser(dispatch));
  return (
    <>
      <AppNavigation
        loading={loading}
        isLoggedIn={isLoggedIn}
        isPermissionsRequested={isPermissionsRequested}
        isFirstTime={isFirstTime}
        isAllPermissionsValid={isAllPermissionsValid}
        hasActiveLoan={hasActiveLoan}
      />
    </>
  );
};

export default MainApp;
