import BaseMask from "./_base.mask";
import CustomMask from "./custom.mask";
import dayjs from "dayjs";

const DATETIME_MASK_SETTINGS = {
  format: "DD/MM/YYYY HH:mm:ss",
};

export default class DatetimeMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        undefined,
        "getValue()",
        "datetime.mask.js"
      )
    );
    return "datetime";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "datetime.mask.js"
      )
    );
    let mergedSettings = this._getMergedSettings(settings);
    let mask = this.getMask(value, mergedSettings);

    return CustomMask.shared.getValue(value, { mask });
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "datetime.mask.js"
      )
    );
    let mergedSettings = this._getMergedSettings(settings);
    return dayjs.parse(maskedValue, mergedSettings.format);
  }

  validate(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "validate method starts here ",
        { value, settings },
        "validate()",
        "datetime.mask.js"
      )
    );
    let maskedValue = this.getValue(value, settings);
    let mergedSettings = this._getMergedSettings(settings);
    let isValid = dayjs.isValid(maskedValue, mergedSettings.format);
    return isValid;
  }

  _getMergedSettings(settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_getMergedSettings method starts here ",
        { settings },
        "_getMergedSettings()",
        "datetime.mask.js"
      )
    );
    return super.mergeSettings(DATETIME_MASK_SETTINGS, settings);
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "datetime.mask.js"
      )
    );
    let mask = "";

    for (let i = 0; i < settings.format.length; i++) {
      mask += settings.format[i].replace(/[a-zA-Z]+/g, "9");
    }

    return mask;
  }
}
