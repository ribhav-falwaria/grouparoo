import React, { useContext } from 'react'
import { useTheme, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { useStore, useSelector } from 'react-redux'
import StepIndicator from 'react-native-step-indicator'
import { LocalizationContext } from '../../components/Translation'
import { CheckedIconSteps } from './ThemedIcons'
import { rupeeFormatter } from '../../utils'

const VerticalStepIndicator = ({
  stepData,
  currentStep,
  loanApplicationId
}) => {
  const theme = useTheme()
  const stepIndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: theme['color-warning-500'],
    separatorFinishedColor: theme['color-warning-300'],
    separatorUnFinishedColor: theme['color-basic-500'],
    stepIndicatorFinishedColor: theme['color-warning-300'],
    stepIndicatorUnFinishedColor: theme['color-basic-500'],
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: theme['color-primary-500'],
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: theme['color-basic-500'],
    labelColor: theme['color-primary-200'],
    labelSize: 15,
    currentStepLabelColor: theme['color-primary-500'],
    labelAlign: 'flex-start'
  }
  const store = useStore()
  const state = useSelector(state => state)
  const selector = store.select(models => ({
    loanAmount: models.loanApplications.getLoanAmount,
    applicationStartDate: models.loanApplications.getStartDate
  }))
  const { loanAmount, applicationStartDate } = selector(state, {
    loanApplicationId
  })
  const { translations } = useContext(LocalizationContext)

  const RenderDetails = () => {
    return (
      <View style={styles.rowItem}>
        <View style={styles.rowItemDetail}>
          <Text category='p1' appearance='hint'>
            {translations['application.applicationNumber']}
          </Text>
          <Text category='s1' appearance='default' status='primary'>
            {loanApplicationId}
          </Text>
        </View>
        <View style={styles.rowItemDetail}>
          <Text category='p1' appearance='hint'>
            {translations['application.form.loanAmount']}
          </Text>
          <Text category='s1' appearance='default' status='primary'>
            <Text category='p1' status='basic'>{'₹ '}</Text>
            {rupeeFormatter(loanAmount)}
          </Text>
        </View>
        <View style={styles.rowItemDetail}>
          <Text category='p1' appearance='hint'>
            {translations['pendingLoanApplication.applicationStartDate']}
          </Text>
          <Text category='s1' appearance='default' status='primary'>
            {applicationStartDate}
          </Text>
        </View>
      </View>
    )
  }
  const renderStepIndicator = ({ position, stepStatus }) => {
    if (stepStatus === 'finished') {
      return <CheckedIconSteps />
    }
  }
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.stepIndicator}>
          <StepIndicator
            customStyles={stepIndicatorStyles}
            stepCount={stepData.length}
            direction='vertical'
            currentPosition={currentStep}
            labels={stepData.map(item => translations[item.title])}
            renderStepIndicator={renderStepIndicator}
          />
        </View>
        <View style={styles.details}>
          <RenderDetails />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    flexDirection: 'row'
  },
  details: {
    flex: 1
  },
  stepIndicator: {
    marginVertical: 16,
    paddingHorizontal: 0,
    flex: 1.5
  },
  rowItem: {
    flex: 3,
    paddingVertical: 24,
    // paddingLeft: 36,
    justifyContent: 'center'
  },
  rowItemDetail: {
    paddingVertical: 16
  }
})

export default VerticalStepIndicator
