// @scripts
import HomeContainer from "../containers/HomeContainer";
import MyLoansContainer from "../containers/MyLoansContainer";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../screens/Errors/ErrorUtil";

const components = {
  HomeContainer,
  MyLoansContainer,
};

/**
 * @param {string} componentName
 * @returns {function}
 */
export const mapComponent = (componentName) =>
  crashlytics().log(
    ErrorUtil.createLog(
      "mapComponent method starts here",
      { componentName },
      "mapComponent()",
      "mapper.js"
    )
  );
components[componentName];
