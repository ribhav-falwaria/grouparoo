import BaseMask from "./_base.mask";

function getDefaultTranslation() {
  return {
    9: function (val) {
      return val.replace(/[^0-9]+/g, "");
    },
    A: function (val) {
      return val.replace(/[^a-zA-Z]+/g, "");
    },
    S: function (val) {
      return val.replace(/[^a-zA-Z0-9]+/g, "");
    },
    "*": function (val) {
      return val;
    },
  };
}

function toPattern(value, mask, translation) {
  let result = "";

  let maskCharIndex = 0;
  let valueCharIndex = 0;

  while (true) {
    // if mask is ended, break.
    if (maskCharIndex === mask.length) {
      break;
    }

    // if value is ended, break.
    if (valueCharIndex === value.length) {
      break;
    }

    let maskChar = mask[maskCharIndex];
    let valueChar = value[valueCharIndex];

    // value equals mask, just set
    if (maskChar === valueChar) {
      result += maskChar;
      valueCharIndex += 1;
      maskCharIndex += 1;
      continue;
    }

    // apply translator if match
    const translationHandler = translation[maskChar];

    if (translationHandler) {
      const resolverValue = translationHandler(valueChar || "");
      if (resolverValue === "") {
        //valueChar replaced so don't add it to result, keep the mask at the same point and continue to next value char
        valueCharIndex += 1;
        continue;
      } else if (resolverValue !== null) {
        result += resolverValue;
        valueCharIndex += 1;
      } else {
        result += maskChar;
      }
      maskCharIndex += 1;
      continue;
    }

    // not masked value, fixed char on mask
    result += maskChar;
    maskCharIndex += 1;
    continue;
  }

  return result;
}

const DEFAULT_TRANSLATION = getDefaultTranslation();

export default class CustomMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getType method starts here ",
        undefined,
        "getType()",
        "custom.mask.js"
      )
    );
    return "custom";
  }

  static getDefaultTranslation() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getDefaultTranslation method starts here ",
        undefined,
        "getDefaultTranslation()",
        "custom.mask.js"
      )
    );
    return getDefaultTranslation();
  }

  static shared = new CustomMask();

  getKeyboardType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getKeyboardType method starts here ",
        undefined,
        "getKeyboardType()",
        "custom.mask.js"
      )
    );
    return "default";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "custom.mask.js"
      )
    );
    if (value === "") {
      return value;
    }
    let { mask } = settings;
    let translation = this.mergeSettings(
      DEFAULT_TRANSLATION,
      settings.translation
    );

    var masked = toPattern(value, mask, translation);
    return masked;
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "custom.mask.js"
      )
    );
    if (!!settings && settings.getRawValue) {
      return settings.getRawValue(maskedValue, settings);
    }

    return maskedValue;
  }

  validate(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "validate method starts here ",
        { value, settings },
        "validate()",
        "custom.mask.js"
      )
    );
    if (!!settings && settings.validator) {
      return settings.validator(value, settings);
    }

    return true;
  }
}
