import { Button, Text } from '@ui-kitten/components'
import React, { useContext, useEffect, useState } from 'react'
import DataService from '../../../../services/DataService'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import { Linking, View, StyleSheet, Alert } from 'react-native'
import isEmpty from 'lodash.isempty'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../../../../../LoadingSpinner'
import Toast from 'react-native-toast-message'
import { LocalizationContext } from '../../../../translation/Translation'
import ReactJsonSchemaUtil from '../../../../services/ReactJsonSchemaFormUtil'
import { useRequest } from 'ahooks'
import crashlytics from '@react-native-firebase/crashlytics'
import ErrorUtil from '../../../../../../Errors/ErrorUtil'
import dayjs from 'dayjs'
import FormSuccess from '../../../Forms/FormSuccess'
const resourceFactoryConstants = new ResourceFactoryConstants()

const getRandomId = () => String(Math.floor(100000 + Math.random() * 900000))

const createPlan = async (planObject) => {
  const res = await DataService.postData(
    resourceFactoryConstants.constants.enach.createPlan,
    planObject
  )
  const data = res.data
  if (data.status === 'SUCCESS') {
    return true
  } else {
    throw new Error('PLAN_CREATION_FAILED')
  }
}

const createSubscription = async (
  formName,
  planId,
  applicationId,
  primaryPhone,
  expiresOn,
  appUrl
) => {
  const res = await DataService.postData(
    resourceFactoryConstants.constants.enach.createSubscription,
    {
      subscriptionId: `${formName}_${getRandomId()}`,
      planId: planId,
      customerEmail: 'nplending@gmail.com',
      customerPhone: primaryPhone || '93465577484',
      expiresOn: expiresOn,
      returnUrl: appUrl
    }
  )
  const data = res.data
  if (data.status === 'SUCCESS') {
    return data.authLink
  } else {
    throw new Error('SUBSCRIPTION_CREATION_FAILED')
  }
}

const EnachWidget = (props) => {
  const applicationId = useSelector(
    (state) => state?.formDetails?.formData?.loanApplicationId
  )
  const jsonSchema = useSelector((state) => state?.formDetails?.schema)
  const formName = jsonSchema?.formName
  const [isRetryEnabled, setIsRetryEnabled] = useState(false)
  const [authLink, setAuthLink] = useState()
  const { translations } = useContext(LocalizationContext)
  const [isPlanCreated, setIsPlanCreated] = useState(false)
  const [isSubscriptionCreated, setIsSubscriptionCreated] = useState(
    !!props.value
  )
  const [appUrl, setAppUrl] = useState(null)
  const [planId, setPlanId] = useState(getRandomId())
  const primaryPhone = useSelector(
    (state) => state.formDetails.formData.primaryPhone
  )

  const planObject = {
    planId: planId,
    planName: `${formName}_${getRandomId()}`,
    type: 'PERIODIC',
    amount: 100,
    intervalType: 'month',
    intervals: 12
  }

  const expiresOn = `${dayjs()
    .add(30 * planObject.intervals, 'day')
    .format('YYYY-MM-DD')} 23:59:59`

  const expiresOnForUi = `${dayjs()
    .add(30 * planObject.intervals, 'day')
    .format('DD-MMM-YYYY')}`
  // Automatically Starts creating Plan
  useEffect(() => {
    if (!props.value) {
      useCreatePlan.run(planObject)
    }
  }, [])

  useEffect(async () => {
    const initialUrl = await Linking.getInitialURL()
    setAppUrl(initialUrl || 'novopay://com.novoloan.customerapp/open')
  }, [])

  const handleUrl = (event) => {
    let errMsg
    let temp = false
    let subRefId
    const returnUrl = event.url
    const queryParamObject = ReactJsonSchemaUtil.getQueryParams(returnUrl)
    for (const key in queryParamObject) {
      if (key === 'cf_status' && queryParamObject[key] !== 'ERROR') {
        setIsSubscriptionCreated(true)
        temp = true
      }
      if (key === 'cf_message') {
        errMsg = queryParamObject[key]
      }
      if (key === 'cf_subReferenceId') {
        subRefId = queryParamObject[key]
      }
    }
    // TODO: Need to Fix, it is getting cath by other handler too
    if (!temp && errMsg) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        props: {
          title: translations['enach.title'],
          description: errMsg
        }
      })
    }
    if (subRefId) {
      props.onChange(subRefId)
    }
  }

  const useCreatePlan = useRequest(createPlan, {
    manual: true,
    onSuccess: () => {
      setIsRetryEnabled(false)
      setIsPlanCreated(true)
      useCreateSubscription.run(
        formName,
        planId,
        applicationId,
        primaryPhone,
        expiresOn,
        appUrl
      )
    },
    onError: (error) => {
      setIsRetryEnabled(true)
      throw error
    }
  })

  const useCreateSubscription = useRequest(createSubscription, {
    manual: true,
    onSuccess: (authLink) => {
      setAuthLink(authLink)
    },
    onError: (error) => {
      throw error
    }
  })

  const openLink = async (eNachUrl) => {
    const supported = await Linking.canOpenURL(eNachUrl)
    if (supported) {
      Linking.addEventListener('url', handleUrl)
      await Linking.openURL(eNachUrl)
    } else {
      crashlytics().log(
        ErrorUtil.createLog(
          'Can not open this url',
          eNachUrl,
          'openLink',
          'EnachWidget.js'
        )
      )
    }
  }

  const eMandateHandler = () => {
    if (isEmpty(authLink)) return
    Alert.alert(translations['enach.title'], translations['enach.redirect'], [
      {
        text: translations['text.okay'],
        onPress: () => {
          openLink(authLink)
        }
      }
    ])
  }
  return (
    <>
      <LoadingSpinner
        visible={useCreatePlan.loading || useCreateSubscription.loading}
      />
      {isRetryEnabled && (
        <Button
          appearance='outline'
          onPress={() => {
            setPlanId((prev) =>
              String(Math.floor(100000 + Math.random() * 900000))
            )
            useCreatePlan.run(planObject)
          }}
        >
          Retry
        </Button>
      )}
      {isPlanCreated && !isSubscriptionCreated && !isRetryEnabled && (
        <>
          <View style={styles.row}>
            <Text category='h6' style={styles.label}>
              {translations['enach.planType']}
            </Text>
            <Text appearance='hint'>
              {planObject.type === 'PERIODIC' ? 'Periodic' : 'No Data'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text category='h6' style={styles.label}>
              {translations['enach.intervalType']}
            </Text>
            <Text appearance='hint'>
              {planObject.intervalType === 'month' ? 'Monthly' : 'No Data'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text category='h6' style={styles.label}>
              {translations['enach.amount']}
            </Text>
            <Text appearance='hint'>₹ {planObject.amount}</Text>
          </View>
          <View style={styles.row}>
            <Text category='h6' style={styles.label}>
              {translations['enach.noOfIntervals']}
            </Text>
            <Text appearance='hint'>{planObject.intervals}</Text>
          </View>
          <View style={styles.row}>
            <Text category='h6' style={styles.label}>
              {translations['enach.expiresOn']}
            </Text>
            <Text appearance='hint'>{expiresOnForUi}</Text>
          </View>
          <View style={styles.row}>
            <Button appearance='outline' onPress={eMandateHandler}>
              {translations['enach.start']}
            </Button>
          </View>
        </>
      )}
      {isSubscriptionCreated && (
        <FormSuccess description={translations['enach.subscription.done']} isButtonVisible={false} />
      )}
    </>
  )
}
const styles = StyleSheet.create({
  row: {
    marginVertical: 5
  },
  label: {
    marginTop: 2
  }
})
export default EnachWidget
