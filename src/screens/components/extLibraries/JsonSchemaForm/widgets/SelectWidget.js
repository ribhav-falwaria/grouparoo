import React from 'react'
import { Select, SelectItem } from '@ui-kitten/components'

import { useFormContext } from '../FormContext'

const SelectWidget = ({
  id,
  options,
  value,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
  onFocus,
  autofocus,
  onBlur,
  schema,
  required
}) => {
  const { enumOptions, enumDisabled } = options

  const { radioLabelMapping } = useFormContext()
  const hasErrors = rawErrors?.length > 0
  const currentSelectedIndex = enumOptions.findIndex(v => v.value === value)
  const onPress = index => {
    const selectedOption = enumOptions[index]
    onChange(selectedOption.value)
  }
  return (
    <Select
      onBlur={() => {
        onBlur(id, value)
      }}
      onFocus={() => {
        onFocus(id, value)
      }}
      autofocus={autofocus}
      selectedIndex={currentSelectedIndex}
      onSelect={onPress}
      status={(hasErrors) && 'danger'}
      disabled={disabled || readonly}
    >
      {enumOptions.map((option, i) => {
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1
        const label = radioLabelMapping
          ? radioLabelMapping(option.label)
          : option.label
        return <SelectItem key={`selopt-${i}`} option={label} disabled={itemDisabled} />
      })}
    </Select>
  )
}

export default SelectWidget
