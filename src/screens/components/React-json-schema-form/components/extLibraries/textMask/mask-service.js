import MaskResolver from "./mask-resolver";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../screens/Errors/ErrorUtil";

export default class MaskService {
  static toMask(type, value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "toMask method starts here ",
        { type, value, settings },
        "toMask()",
        "MaskService.js"
      )
    );
    return MaskResolver.resolve(type).getValue(value, settings);
  }

  static toRawValue(type, maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "toRawValue method starts here ",
        { type, maskedValue, settings },
        "toRawValue()",
        "MaskService.js"
      )
    );
    return MaskResolver.resolve(type).getRawValue(maskedValue, settings);
  }

  static isValid(type, value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "isValid method starts here ",
        { type, value, settings },
        "isValid()",
        "MaskService.js"
      )
    );
    return MaskResolver.resolve(type).validate(value, settings);
  }

  static getMask(type, value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { type, value, settings },
        "getMask()",
        "MaskService.js"
      )
    );
    return MaskResolver.resolve(type).getMask(value, settings);
  }
}
