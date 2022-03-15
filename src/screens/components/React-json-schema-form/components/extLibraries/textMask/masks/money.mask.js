import BaseMask from "./_base.mask";
import VanillaMasker from "../internal-dependencies/vanilla-masker";

const MONEY_MASK_SETTINGS = {
  precision: 0,
  separator: ".",
  delimiter: ",",
  unit: "",
  suffixUnit: "",
};

export default class MoneyMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        undefined,
        "getValue()",
        "money.mask.js"
      )
    );
    return "money";
  }

  getValue(value, settings, oldValue) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "money.mask.js"
      )
    );
    const mergedSettings = super.mergeSettings(MONEY_MASK_SETTINGS, settings);

    let sanitized = this._sanitize(value, mergedSettings);

    if (mergedSettings.suffixUnit && oldValue && sanitized) {
      if (sanitized.length === oldValue.length - 1) {
        const cleared = this.removeNotNumbers(sanitized);
        sanitized = cleared.substr(0, cleared.length - 1);
      }
    }

    const masked = VanillaMasker.toMoney(sanitized, mergedSettings);

    return masked;
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "money.mask.js"
      )
    );
    const mergedSettings = super.mergeSettings(MONEY_MASK_SETTINGS, settings);
    let normalized = super.removeNotNumbers(maskedValue);

    const dotPosition = normalized.length - mergedSettings.precision;
    normalized = this._insert(normalized, dotPosition, ".");

    return Number(normalized);
  }

  validate(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "validate method starts here ",
        { value, settings },
        "validate()",
        "money.mask.js"
      )
    );
    return true;
  }

  _sanitize(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_sanitize method starts here ",
        { value, settings },
        "_sanitize()",
        "money.mask.js"
      )
    );
    if (typeof value === "number") {
      return value.toFixed(settings.precision);
    }

    return value;
  }

  _insert(text, index, string) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_insert method starts here ",
        { text, index, string },
        "_insert()",
        "money.mask.js"
      )
    );
    if (index > 0) {
      return (
        text.substring(0, index) + string + text.substring(index, text.length)
      );
    } else {
      return string + text;
    }
  }
}
