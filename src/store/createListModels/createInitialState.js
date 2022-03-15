import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../screens/Errors/ErrorUtil";
export default (listNames, initialState) =>
  crashlytics().log(
    ErrorUtil.createLog(
      "createInitialState method starts here",
      { listNames, initialState },
      "createInitialState()",
      "createInitialState.js"
    )
  );
Object.assign(
  {},
  {
    byId: {},
    pagination: {},
  },
  listNames.reduce(
    (acc, listName) => Object.assign(acc, { [listName]: [] }),
    {}
  ),
  initialState
);
