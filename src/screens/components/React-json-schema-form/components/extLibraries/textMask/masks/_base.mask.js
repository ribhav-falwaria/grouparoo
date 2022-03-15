import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";
export default class BaseMask {
  getKeyboardType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getKeyboardType method starts here ",
        undefined,
        "getKeyboardType()",
        "BaseMask.js"
      )
    );
    return "numeric";
  }

  mergeSettings(obj1, obj2) {
    crashlytics().log(
      ErrorUtil.createLog(
        "mergeSettings method starts here ",
        { obj1, obj2 },
        "mergeSettings()",
        "BaseMask.js"
      )
    );
    var obj3 = {};
    for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "BaseMask.js"
      )
    );
    return maskedValue;
  }

  getDefaultValue(value) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getDefaultValue method starts here ",
        { value },
        "getDefaultValue()",
        "BaseMask.js"
      )
    );
    if (value === undefined || value === null) {
      return "";
    }

    return value;
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "BaseMask.js"
      )
    );
    throw new Error("getCurrentMask is not implemented");
  }

  removeNotNumbers(text) {
    crashlytics().log(
      ErrorUtil.createLog(
        "removeNotNumbers method starts here ",
        { text },
        "removeNotNumbers()",
        "BaseMask.js"
      )
    );
    return text.replace(/[^0-9]+/g, "");
  }

  removeWhiteSpaces(text) {
    crashlytics().log(
      ErrorUtil.createLog(
        "removeWhiteSpaces method starts here ",
        { text },
        "removeWhiteSpaces()",
        "BaseMask.js"
      )
    );
    return (text || "").replace(/\s/g, "");
  }
}
