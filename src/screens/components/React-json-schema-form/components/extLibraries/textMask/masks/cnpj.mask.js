import BaseMask from "./_base.mask";
import CustomMask from "./custom.mask";

export const CNPJ_MASK = "99.999.999/9999-99";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../Errors/ErrorUtil";

export const validateCnpj = (cnpj) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "validateCnpj method starts here ",
      { cnpj },
      "validateCnpj()",
      "cnpj.mask.js"
    )
  );
  var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
  var dig1 = new Number();
  var dig2 = new Number();
  var i = 0;

  var exp = /\.|\-|\//g;
  cnpj = cnpj.toString().replace(exp, "");
  var digito = new Number(eval(cnpj.charAt(12) + cnpj.charAt(13)));

  for (i = 0; i < valida.length; i++) {
    dig1 += i > 0 ? cnpj.charAt(i - 1) * valida[i] : 0;
    dig2 += cnpj.charAt(i) * valida[i];
  }
  dig1 = dig1 % 11 < 2 ? 0 : 11 - (dig1 % 11);
  dig2 = dig2 % 11 < 2 ? 0 : 11 - (dig2 % 11);

  return dig1 * 10 + dig2 == digito;
};

const customMaskOptions = { mask: CNPJ_MASK };

export default class CnpjMask extends BaseMask {
  static getType() {
    crashlytics().log(
      ErrorUtil.createLog(
        "getType method starts here ",
        undefined,
        "getType()",
        "cnpj.mask.js"
      )
    );
    return "cnpj";
  }

  getValue(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getValue method starts here ",
        { value, settings },
        "getValue()",
        "cnpj.mask.js"
      )
    );
    return CustomMask.shared.getValue(value, customMaskOptions);
  }

  getRawValue(maskedValue, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getRawValue method starts here ",
        { maskedValue, settings },
        "getRawValue()",
        "cnpj.mask.js"
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
        "cnpj.mask.js"
      )
    );
    var isEmpty = (value || "").trim().length === 0;
    return !isEmpty && validateCnpj(value);
  }

  getMask(value, settings) {
    crashlytics().log(
      ErrorUtil.createLog(
        "getMask method starts here ",
        { value, settings },
        "getMask()",
        "cnpj.mask.js"
      )
    );
    return CNPJ_MASK;
  }
}
