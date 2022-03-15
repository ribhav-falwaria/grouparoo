import BaseMask from "./_base.mask";
import CustomMask from "./custom.mask";

const ZIP_CODE_MASK = "999-999";

const MASK_OPTIONS = {
  mask: ZIP_CODE_MASK,
};

export default class ZipCodeMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        undefined,
        "getValue()",
        "ZipCodeMask.js"
      )
    );
    return "zip-code";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "ZipCodeMask.js"
      )
    );
    return CustomMask.shared.getValue(value, MASK_OPTIONS);
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "ZipCodeMask.js"
      )
    );
    return super.removeNotNumbers(maskedValue);
  }

  validate(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "validate method starts here ",
        { value, settings },
        "validate()",
        "ZipCodeMask.js"
      )
    );
    if (!!value) {
      return value.length === ZIP_CODE_MASK.length;
    }

    return true;
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "ZipCodeMask.js"
      )
    );
    return ZIP_CODE_MASK;
  }
}
