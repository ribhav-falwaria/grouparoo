import React from 'react'
import MaskedInput from '../../textMask/text-input-mask'
import { Text } from '@ui-kitten/components'
import { useFormContext } from '../FormContext'

const MobileWidget = ({
  id,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  multiline,
  secureEntry,
  schema,
  textContentType = 'none',
  rawErrors = [],
  required
}) => {
  const { theme } = useFormContext()
  const hasErrors = rawErrors.length > 0

  return (
    <MaskedInput
      type='cel-phone'
      options={{
        maskType: 'MBL',
        withDDD: true,
        dddMask: ''
      }}
      includeRawValueInChangeText
      multiline={multiline}
      placeholder={label}
      autoFocus={autofocus}
      editable={!disabled && !readonly}
      keyboardType={schema.type === 'number' ? 'numeric' : 'default'}
      value={value ? value.toString() : ''}
      secureTextEntry={secureEntry}
      textContentType={textContentType}
      onChangeText={(newText, rawText) => onChange(rawText === '' ? options.emptyValue : rawText)}
      onBlur={() => {
        onBlur(id, value)
      }}
      onFocus={() => {
        onFocus(id, value)
      }}
      selectionColor={theme.highlightColor}
      placeholderTextColor={theme.placeholderTextColor}
      status={(hasErrors) && 'danger'}
      accessoryLeft={() => <Text>+91</Text>}
    />
  )
}

export default MobileWidget
