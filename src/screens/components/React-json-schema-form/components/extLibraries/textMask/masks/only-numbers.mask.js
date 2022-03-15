import BaseMask from "./_base.mask";

export default class OnlyNumbersMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        undefined,
        "getValue()",
        "only-numbers.mask.js"
      )
    );
    return "only-numbers";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "only-numbers.mask.js"
      )
    );
    return this.removeNotNumbers(String(value));
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "only-numbers.mask.js"
      )
    );
    return super.removeNotNumbers(String(maskedValue));
  }

  validate(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "validate method starts here ",
        { value, settings },
        "validate()",
        "only-numbers.mask.js"
      )
    );
    return true;
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "only-numbers.mask.js"
      )
    );
    return "";
  }
}
