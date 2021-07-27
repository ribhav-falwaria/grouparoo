import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { RNForm } from '../../components/extLibraries/JsonSchemaForm'
const JsonSchemaForm = props => {
  const {
    formData,
    schema,
    uiSchema,
    onSubmit,
    liveValidate,
    stepIndex,
    onError,
    setFormRef,
    validate
  } = props
  console.log("FORM")
  console.log(formData)
  return (
    <KeyboardAwareScrollView>
      <RNForm
        ref={form => {
          setFormRef(form)
        }}
        onError={onError}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={form => onSubmit(form, stepIndex)}
        formData={formData || {}}
        liveValidate={liveValidate}
        validate={validate}
      >
        {props.children}
      </RNForm>
    </KeyboardAwareScrollView>
  )
}

export default JsonSchemaForm
