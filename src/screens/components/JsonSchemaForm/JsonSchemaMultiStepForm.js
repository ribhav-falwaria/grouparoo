import React, { useState, useContext, useRef } from 'react'
import { View } from 'react-native'

import isEmpty from 'lodash.isempty'
import { useStyleSheet, StyleService, Button } from '@ui-kitten/components'
import JSonSchemaForm from './JsonSchemaForm'
import { getSchemaForStep } from './utils'
import SpinnerButton from '../SpinnerButton'
import styleConstants from '../../styleConstants'
import HorizontalProgressBar from '../HorizontalProgressBar'
import { LocalizationContext } from '../../../components/Translation'
const FIRST_STEP_INDEX = 1
const JsonSchemaMultiStepForm = ({
  formData,
  schema,
  uiSchema,
  errorSchema,
  steps,
  onFormSubmit
}) => {
  const styles = useStyleSheet(themeStyles)
  let thisFormRef
  const { translations } = useContext(LocalizationContext)
  const [currentStep, setCurrentStep] = useState(FIRST_STEP_INDEX)
  const [isSubmit, setIsSubmit] = useState(false)
  const [newErrorSchema, setNewErrorSchema] = useState(errorSchema)
  const [loading, setLoading] = useState(false)
  const totalSteps = Object.keys(steps).length
  const step = steps[currentStep.toString()]
  step.liveValidate = isSubmit
  const onSubmit = async (form, stepIndex) => {
    const { errors, errorSchema, formData } = form
    if (errors.length > 0) {
      return
    }
    setLoading(true)
    setIsSubmit(true)
    await onFormSubmit(formData, steps[stepIndex.toString()])
    if (isEmpty(errors)) {
      // If all well, move to next step
      setLoading(false)
      setCurrentStep(stepIndex + 1)
    } else {
      // Set current error
      setNewErrorSchema(errorSchema)
    }
  }
  const setFormRef = ref => {
    thisFormRef = ref
  }
  const onPrevious = () => {
    const step = currentStep - 1
    setCurrentStep(step)
  }
  const onNext = () => {
    // Force a form Submit
    thisFormRef.submit()
  }
  const onError = errorSchema => {
    setNewErrorSchema(errorSchema)
  }
  const { newSchema, newUiSchema } = getSchemaForStep({
    schema,
    uiSchema,
    step
  })
  console.log("MULTIFORM")
  console.log(formData)
  return (
    <>
      <HorizontalProgressBar progressNum={(currentStep * 100) / totalSteps} />
      <View style={styles.container}>
        <JSonSchemaForm
          stepIndex={currentStep}
          setFormRef={setFormRef}
          onError={onError}
          schema={newSchema}
          uiSchema={newUiSchema}
          onSubmit={onSubmit}
          formData={formData}
          errorSchema={newErrorSchema}
          liveValidate={step.liveValidate}
        >
          <>
            <Button
              style={styles.buttonStyle}
              onPress={onPrevious}
              status='basic'
              disabled={currentStep === FIRST_STEP_INDEX}
            >
              {translations['form.previous']}
            </Button>

            {currentStep < totalSteps && (
              <SpinnerButton
                style={styles.buttonStyle}
                loading={loading}
                onPress={onNext}
              >
                {translations['form.next']}
              </SpinnerButton>
            )}
            {currentStep === totalSteps && (
              <SpinnerButton
                style={styles.buttonStyle}
                loading={loading}
                onPress={onSubmit}
              >
                {translations['form.submit']}
              </SpinnerButton>
            )}
          </>
        </JSonSchemaForm>
      </View>
    </>
  )
}

const themeStyles = StyleService.create({
  buttonsContainer: {
    flexDirection: 'row'
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  buttonStyle: {
    width: '40%'
  },
  container: {
    ...styleConstants.contentContainer
  }
})

export default JsonSchemaMultiStepForm
