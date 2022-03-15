import FinBoxRiskSdk from "react-native-risk-sdk";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";
const syncSmsDataPeriodic = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "syncSmsDataPeriodic method starts here",
      undefined,
      "syncSmsDataPeriodic()",
      "finbox.js"
    )
  );
  FinBoxRiskSdk.createUser(
    "CLIENT_API_KEY",
    "CUSTOMER_ID",
    (errorStatus) => {
      // Error Callback
      console.log("Error status -> ", errorStatus);
    },
    (msg) => {
      // Success Callback, Call the periodic sync once the user has been created
      console.log("Final message", msg);
      // Start the sync periodically after every 12 hour
      FinBoxRiskSdk.startPeriodicSync(12);
    }
  );
};
const resetSync = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "resetSync method starts here",
      undefined,
      "resetSync()",
      "finbox.js"
    )
  );
};
export { syncSmsDataPeriodic, resetSync };
