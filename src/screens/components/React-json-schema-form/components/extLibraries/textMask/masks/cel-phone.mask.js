import BaseMask from "./_base.mask";
import CustomMask from "./custom.mask";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

const PHONE_8_MASK = "999-9999-9999";
const PHONE_10_MASK = "99999-99999";
const PHONE_INTERNATIONAL = "+999 999 999 999";

const MASK_TYPES = {
  MBL: "MBL",
  LL: "LL",
  INTERNATIONAL: "INTERNATIONAL",
};

const CEL_PHONE_SETTINGS = {
  maskType: MASK_TYPES.MBL,
  withDDD: true,
  dddMask: "+91 ",
};

export default class CelPhoneMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getType method starts here ",
        undefined,
        "getType()",
        "CelPhoneMask.js"
      )
    );
    return "cel-phone";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "CelPhoneMask.js"
      )
    );
    let cleanedValue = super.removeNotNumbers(value);
    let mask = this.getMask(cleanedValue, settings);
    return CustomMask.shared.getValue(cleanedValue, { mask });
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "CelPhoneMask.js"
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
        "CelPhoneMask.js"
      )
    );
    let valueToValidate = super.getDefaultValue(value);
    valueToValidate = this.getValue(value, settings);

    const mask = this.getMask(value, settings);

    return valueToValidate.length === mask.length;
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "CelPhoneMask.js"
      )
    );
    const mergedSettings = super.mergeSettings(CEL_PHONE_SETTINGS, settings);
    let mask = PHONE_10_MASK;
    if (mergedSettings.maskType === MASK_TYPES.INTERNATIONAL) {
      return PHONE_INTERNATIONAL;
    }
    if (mergedSettings.maskType === MASK_TYPES.MBL) {
      mask = PHONE_10_MASK;
    }
    if (mergedSettings.maskType === MASK_TYPES.LL) {
      mask = PHONE_8_MASK;
    }
    if (mergedSettings.withDDD) {
      mask = `${mergedSettings.dddMask}${mask}`;
    }
    return mask;
  }
}
