import BaseMask from "./_base.mask";
import CustomMask from "./custom.mask";

const CREDIT_CARD_MASKS = {
  "visa-or-mastercard": {
    regular: "9999 9999 9999 9999",
    obfuscated: "9999 **** **** 9999",
  },
  amex: {
    regular: "9999 999999 99999",
    obfuscated: "9999 ****** 99999",
  },
  diners: {
    regular: "9999 999999 9999",
    obfuscated: "9999 ****** 9999",
  },
};

const CREDIT_CARD_SETTINGS = {
  obfuscated: false,
  issuer: "visa-or-mastercard",
};

const MASK_TRANSLATION = {
  "*": (val) => null,
};

export default class CreditCardMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getType method starts here ",
        undefined,
        "getType()",
        "credit-card.mask.js"
      )
    );
    return "credit-card";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "credit-card.mask.js"
      )
    );
    let selectedMask = this.getMask(value, settings);
    return CustomMask.shared.getValue(value, {
      mask: selectedMask,
      translation: MASK_TRANSLATION,
    });
  }

  validate(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "validate method starts here ",
        { value, settings },
        "validate()",
        "credit-card.mask.js"
      )
    );
    if (!!value) {
      let selectedMask = this.getMask(value, settings);
      return value.length === selectedMask.length;
    }

    return true;
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "credit-card.mask.js"
      )
    );
    if (!maskedValue) return [];

    return maskedValue.split(" ").map((val) => {
      if (!val) return "";

      return val.trim();
    });
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "credit-card.mask.js"
      )
    );
    let mergedSettings = super.mergeSettings(CREDIT_CARD_SETTINGS, settings);
    const selectedMask = this._selectMask(
      mergedSettings.issuer,
      mergedSettings.obfuscated
    );

    return selectedMask;
  }

  _selectMask(issuer, obfuscated) {
    crashlytics().log(
      ErrorUtil.createLog(
        "_selectMask method starts here ",
        { issuer, obfuscated },
        "_selectMask()",
        "credit-card.mask.js"
      )
    );
    const maskType = obfuscated ? "obfuscated" : "regular";

    return CREDIT_CARD_MASKS[issuer][maskType];
  }
}
