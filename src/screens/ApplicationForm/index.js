import React, { useState } from 'react'
import { View } from 'react-native'
import isEmpty from 'lodash.isempty'
import { useStore, useSelector, useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import { StyleService, useStyleSheet } from '@ui-kitten/components'
import LoadingSpinner from '../components/LoadingSpinner'
import JsonSchemaMultiStepForm from '../components/JsonSchemaForm/JsonSchemaMultiStepForm'
import styleConstants from '../styleConstants'

const loadApplicationForm = async (dispatch, loanType) => {
  console.log('Getting loan App')
  return dispatch.applicationForms.getByIdAsync({
    id: loanType.formName,
    params: loanType
  })
}
const createLoanApplication = async (
  dispatch,
  { formData, customer, loanType, onSuccess }
) => {
  const data = {
    formData,
    customer,
    loanType
  }
  return dispatch.loanApplications.createAsync({ data, onSuccess })
}
const updateLoanApplication = async (
  dispatch,
  { formData, customer, loanType, loanApplicationId }
) => {
  return dispatch.loanApplications.updateAsync(loanApplicationId, {
    formData,
    customer,
    loanType
  })
}
const ApplicationForm = ({ navigation, route }) => {
  let currentLoanAppId
  if (route.params) {
    currentLoanAppId = route.params.currentLoanAppId
  }
  const [loanApplicationId, setLoanApplicationId] = useState(currentLoanAppId)
  const styles = useStyleSheet(themedStyles)
  const store = useStore()
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const selection = store.select(models => ({
    defaultLoanType: models.loanTypes.getDefaultLoanType,
    customer: models.customer.getCustomer,
    loanType: models.loanTypes.getLoanTypeForApplicationId,
    loanApplication: models.loanApplications.getApplicationById
  }))
  const { defaultLoanType, customer, loanType, loanApplication } = selection(
    state,
    {
      loanApplicationId,
      id: loanApplicationId
    }
  )
  const currentLoanType = isEmpty(loanType) ? defaultLoanType : loanType
  const applicationForm = store.select.applicationForms.getById(
    state,
    currentLoanType.formName
  )
  const { loading } = useRequest(() =>
    loadApplicationForm(dispatch, currentLoanType)
  )
  const createLoanApplicationRequest = useRequest(createLoanApplication, {
    manual: true
  })
  const updateLoanApplicationRequest = useRequest(updateLoanApplication, {
    manual: true
  })
  const onError = () => {}
  const onSubmit = async (formData, step) => {
    formData.stepName = step.stepName
    if (loanApplication && !isEmpty(loanApplication)) {
      // existing form
      await updateLoanApplicationRequest.run(dispatch, {
        formData,
        loanApplicationId,
        customer,
        loanType: currentLoanType
      })
    } else {
      const onSuccess = ({ id }) => {
        setLoanApplicationId(id)
      }
      createLoanApplicationRequest.run(dispatch, {
        formData,
        customer,
        loanType: currentLoanType,
        onSuccess
      })
    }
  }
  if (
    loading ||
    createLoanApplicationRequest.loading ||
    updateLoanApplicationRequest.loading
  ) {
    return <LoadingSpinner />
  }
  const {
    jsonSchema,
    uiSchema: { values },
    schemaSteps: { steps }
  } = applicationForm
  const formData = loanApplication ? loanApplication.formData : {}
  const errors = loanApplication ? loanApplication.errors : {}
  console.log('INDEX')
  console.log(formData)
  return (
    <View style={styles.container}>
      <JsonSchemaMultiStepForm
        schema={jsonSchema}
        errorSchema={errors}
        uiSchema={values}
        steps={steps}
        formData={formData}
        onError={onError}
        onFormSubmit={onSubmit}
      />
    </View>
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    ...styleConstants.container,
    marginHorizontal: 16
  }
})
export default ApplicationForm
