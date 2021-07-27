import BaseMask from './_base.mask'
import CustomMask from './custom.mask'

const PHONE_8_MASK = '999-9999-9999'
const PHONE_10_MASK = '99999-99999'
const PHONE_INTERNATIONAL = '+999 999 999 999'

const MASK_TYPES = {
  MBL: 'MBL',
  LL: 'LL',
  INTERNATIONAL: 'INTERNATIONAL'
}

const CEL_PHONE_SETTINGS = {
  maskType: MASK_TYPES.MBL,
  withDDD: true,
  dddMask: '+91 '
}

export default class CelPhoneMask extends BaseMask {
  static getType () {
    return 'cel-phone'
  }

  getValue (value, settings) {
    let cleanedValue = super.removeNotNumbers(value)
    let mask = this.getMask(cleanedValue, settings)
    return CustomMask.shared.getValue(cleanedValue, { mask })
  }

  getRawValue (maskedValue, settings) {
    return super.removeNotNumbers(maskedValue)
  }

  validate (value, settings) {
    let valueToValidate = super.getDefaultValue(value)
    valueToValidate = this.getValue(value, settings)

    const mask = this.getMask(value, settings)

    return valueToValidate.length === mask.length
  }

  getMask (value, settings) {
    const mergedSettings = super.mergeSettings(CEL_PHONE_SETTINGS, settings)
    let mask = PHONE_10_MASK
    if (mergedSettings.maskType === MASK_TYPES.INTERNATIONAL) {
      return PHONE_INTERNATIONAL
    }
    if (mergedSettings.maskType === MASK_TYPES.MBL) {
      mask = PHONE_10_MASK
    }
    if (mergedSettings.maskType === MASK_TYPES.LL) {
      mask = PHONE_8_MASK
    }
    if (mergedSettings.withDDD) {
      mask = `${mergedSettings.dddMask}${mask}`
    }
    return mask
  }
}
