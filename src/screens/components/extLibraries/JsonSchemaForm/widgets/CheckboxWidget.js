import React from 'react'
import { CheckBox } from '@ui-kitten/components'
import DescriptionField from '../fields/DescriptionField'

const CheckboxWidget = ({
  value,
  disabled,
  readonly,
  label,
  onChange,
  schema,
  rawErrors = [],
  required
}) => {
  const isDisabled = readonly || disabled
  const hasErrors = rawErrors.length > 0

  return (
    <>
      {schema.description ? (<DescriptionField description={schema.description} />) : null}
      <CheckBox
        checked={value}
        onChange={onChange}
        disabled={isDisabled || readonly}
        status={(hasErrors) && 'danger'}
      >
        {schema.title || label}
      </CheckBox>
    </>
  )
}

export default CheckboxWidget
