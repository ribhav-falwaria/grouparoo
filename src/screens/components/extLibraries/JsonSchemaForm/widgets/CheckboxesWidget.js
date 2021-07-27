import React from 'react'

import { CheckBoxComponent } from './CheckboxWidget'
import { View } from 'react-native'

const selectValue = (value, selected, all) => {
  const at = all.indexOf(value)
  const updated = selected.slice(0, at).concat(value, selected.slice(at))

  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) - all.indexOf(b))
}

const deselectValue = (value, selected) => selected.filter(v => v !== value)

const CheckboxesWidget = ({ disabled, options, value, readonly, onChange, required, rawErrors = [] }) => {
  const { enumOptions, enumDisabled } = options

  const _onChange = option => checked => {
    const all = enumOptions.map(({ value: v }) => v)

    if (checked) {
      onChange(selectValue(option.value, value, all))
    } else {
      onChange(deselectValue(option.value, value))
    }
  }

  return (
    <View>
      {enumOptions.map((option, index) => {
        const checked = value.indexOf(option.value) !== -1
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1
        return (
          <CheckBoxComponent
            key={index}
            onChange={_onChange(option)}
            selected={checked}
            label={option.label}
            disabled={disabled || itemDisabled || readonly}
            rawErrors={rawErrors}
            required={required}
          />
        )
      })}
    </View>
  )
}

export default CheckboxesWidget
