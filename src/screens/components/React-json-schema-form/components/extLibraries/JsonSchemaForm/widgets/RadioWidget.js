import React, { useState } from 'react'
import { Radio, RadioGroup } from '@ui-kitten/components'

import { useFormContext } from '../FormContext'

const RadioWidget = ({
  options,
  value,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
  required
}) => {
  const { enumOptions, enumDisabled } = options
  const { radioLabelMapping } = useFormContext()
  const hasErrors = rawErrors.length > 0
  const currentSelectedIndex = enumOptions.findIndex(v => v.value === value)
  const [selectedIndex, setSelectedIndex] = useState(currentSelectedIndex)
  const onPress = newValue => () => onChange(newValue)

  return (
    <RadioGroup
      selectedIndex={selectedIndex}
      onChange={index => setSelectedIndex(index)}
    >
      {enumOptions.map((option, i) => {
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1
        const label = radioLabelMapping
          ? radioLabelMapping(option.label)
          : option.label

        return (
          <Radio
            key={`radio-${i}`}
            disabled={disabled || itemDisabled || readonly}
            onPress={onPress(option.value)}
            status={(hasErrors) && 'danger'}
          >
            {label}
          </Radio>
        )
      })}
    </RadioGroup>
  )
}

export default RadioWidget
