import { config } from "../../config";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../Errors/ErrorUtil";
const handleSuccess = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleSuccess method starts here",
      undefined,
      "handleSuccess()",
      "utils.js"
    )
  );
  return {
    transactionComplete: true,
    success: true,
  };
};

const handleFlagged = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleFlagged method starts here",
      undefined,
      "handleFlagged()",
      "utils.js"
    )
  );
  return {
    transactionComplete: true,
    success: false,
    tryAgain: true,
  };
};

const handlePending = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handlePending method starts here",
      undefined,
      "handlePending()",
      "utils.js"
    )
  );
  return {
    transactionComplete: true,
    success: false,
    tryAgain: false,
  };
};
const handleFailed = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleFailed method starts here",
      undefined,
      "handleFailed()",
      "utils.js"
    )
  );
  return {
    transactionComplete: true,
    success: false,
    tryAgain: true,
  };
};

const handleCancelled = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleCancelled method starts here",
      undefined,
      "handleCancelled()",
      "utils.js"
    )
  );
  return {
    transactionComplete: false,
    success: false,
    tryAgain: true,
  };
};

const handleIncomplete = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleIncomplete method starts here",
      undefined,
      "handleIncomplete()",
      "utils.js"
    )
  );
  return {
    transactionComplete: false,
    success: false,
    tryAgain: false,
  };
};

const handleUserDropped = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleUserDropped method starts here",
      undefined,
      "handleUserDropped()",
      "utils.js"
    )
  );
  return {
    transactionComplete: false,
    success: false,
    tryAgain: true,
  };
};

const handleVoid = () => {
  crashlytics().log(
    ErrorUtil.createLog(
      "handleVoid method starts here",
      undefined,
      "handleVoid()",
      "utils.js"
    )
  );
  return {
    transactionComplete: false,
    success: false,
    tryAgain: true,
  };
};
const statusActions = {
  [config.CASHFREE_STATUSES.SUCCESS]: handleSuccess,
  [config.CASHFREE_STATUSES.FLAGGED]: handleFlagged,
  [config.CASHFREE_STATUSES.PENDING]: handlePending,
  [config.CASHFREE_STATUSES.FAILED]: handleFailed,
  [config.CASHFREE_STATUSES.CANCELLED]: handleCancelled,
  [config.CASHFREE_STATUSES.INCOMPLETE]: handleIncomplete,
  [config.CASHFREE_STATUSES.USER_DROPPED]: handleUserDropped,
  [config.CASHFREE_STATUSES.VOID]: handleVoid,
};

export default statusActions;
