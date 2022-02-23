import React from 'react'
import { Autocomplete, AutocompleteItem } from '@ui-kitten/components'
import { useFormContext } from '../FormContext'
import IconUtil from '../../../common/IconUtil'
const filter = (item, query) =>
  item.label.toLowerCase().includes(query.toLowerCase())

const AutoCompleteWidget = ({
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
  schema,
  textContentType = 'none',
  rawErrors = [],
  required
}) => {
  const { theme } = useFormContext()
  const selectedValue = options.find(op => options.value === value)
  const [queryValue, setQueryValue] = React.useState(selectedValue.label)
  const [data, setData] = React.useState(options)
  const hasErrors = rawErrors.length > 0

  const onChangeText = query => {
    setQueryValue(query)
    setData(options.filter(op => filter(op, query)))
  }
  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item.label} />
  )
  const onSelect = (index) => {
    setQueryValue(options[index].label)
    onChange(options[index].value)
  }
  const clearInput = () => {
    setQueryValue('')
    setData(options)
  }
  const CancelAccessory = (props) => {
    <IconUtil.CancelIcon {...props} onPress={clearInput} />
  }
  return (
    <Autocomplete
      placeholder={label}
      autoFocus={autofocus}
      editable={!disabled && !readonly}
      keyboardType={schema.type === 'number' ? 'numeric' : 'default'}
      value={queryValue}
      textContentType={textContentType}
      onChangeText={onChangeText}
      onSelect={onSelect}
      onBlur={() => {
        onBlur(id, value)
      }}
      onFocus={() => {
        onFocus(id, value)
      }}
      selectionColor={theme.highlightColor}
      placeholderTextColor={theme.placeholderTextColor}
      status={hasErrors && 'danger'}
      accessoryRight={CancelAccessory}
    >
      {data.map(renderOption)}
    </Autocomplete>
  )
}

export default AutoCompleteWidget
