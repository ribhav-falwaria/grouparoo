import React from "react";
import { useSelector } from "react-redux";
import useAppState from "react-native-appstate-hook";
import apiService from "../apiService";
import dayjs from "dayjs";
import { config } from "../config";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
// render `inactive` screen via top-level `AppStateManager` component
const AppStateManager = (props) => {
  crashlytics().log(
    ErrorUtil.createLog(
      " AppStateManager method starts here",
      { props },
      "AppStateManager()",
      "AppStateManager.js"
    )
  );
  const customerDetails = useSelector(
    (state) => state.customer.customerDetails
  );
  useAppState({
    onForeground: apiService.appApi.stateEvents.send({
      customerId: customerDetails?.$id || "NA",
      appStatus: "active",
      createdOn: dayjs().valueOf(),
      eventTypeId: config.EVENT_ACTIVE,
    }),
    onBackground: apiService.appApi.stateEvents.send({
      customerId: customerDetails?.$id || "NA",
      appStatus: "background",
      createdOn: dayjs().valueOf(),
      eventTypeId: config.EVENT_ACTIVE,
    }),
  });
  return <>{props.children}</>;
};

export default AppStateManager;
