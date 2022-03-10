import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import isUndefined from 'lodash.isundefined'
import { Image, View } from 'react-native'
import {
  ListItem, Button, Divider, List, Text, StyleService,
  useStyleSheet, Spinner, useTheme
} from '@ui-kitten/components'
import dayjs from 'dayjs'
import useAppState from 'react-native-appstate-hook'

import { CreditCardIcon, NetBankingIcon } from '../components/ThemedIcons'
import RNPgReactNativeSdk from 'react-native-pg-react-native-sdk'
import { useRequest } from 'ahooks'
import { customAlphabet } from 'nanoid'

import ScreenTitle from '../components/ScreenTitle'
import { LocalizationContext } from '../../components/Translation'
import { config } from '../../config'
import apiService from '../../apiService'
import statusActions from './utils'
import PaymentSuccessView from './PaymentSuccessView'
import PaymentFailureView from './PaymentFailureView'
import PaymentRetryView from './PaymentRetryView'
import LoadingSpinner from '../components/LoadingSpinner'
const METHOD_UPI = 'upi'
const METHOD_WEB = 'web'
const getOrderId = (loanId) => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

  return `${nanoid()}${loanId.substr(loanId.length - 4)}`
}
const getUpiChoices = async () => {
  const upiChoices = await RNPgReactNativeSdk.getUPIApps()
  return upiChoices
}

const generatePaymentToken = async (loanId, amount, mode, id) => {
  const env = config.PAYMENT_ENV
  const executionId = await apiService.appApi.cashfree.token.execute(loanId, amount, env)
  const cfToken = await apiService.appApi.cashfree.token.get(executionId)
  return {
    cfToken,
    mode,
    id
  }
}

const Payments = ({ navigation, route }) => {
  const { params: { loanId, amount } } = route
  // if (isUndefined(loanId) || isUndefined(amount)) {
  //   navigation.goBack()
  // }
  const theme = useTheme()
  const { customerDetails } = useSelector(state => state.customer)
  useAppState({
    onBackground: () => apiService.appApi.stateEvents.send({
      customerId: customerDetails.$id,
      appStatus: 'background',
      createdOn: dayjs().valueOf(),
      eventTypeId: config.EVENT_PAYMENT_DROP
    })
  })
  const env = config.PAYMENT_ENV
  const [npStatus, setNpStatus] = useState({
    transactionComplete: false,
    success: false,
    tryAgain: false
  })
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  const title = route.params?.title || translations['payments.title']
  const handlePaymentCallback = async (result) => {
    const orderResult = JSON.parse(result)
    orderResult.loanApplicationId = loanId
    // FIXME: Put it back
    let verified = true
    if (result.signature && result.signature.length > 0) {
      const executionId = await apiService.appApi.cashfree.signatureVerify.execute(orderResult)
      verified = await apiService.appApi.cashfree.signatureVerify.get(executionId)
    }
    if (verified) {
      const npStatus = statusActions[orderResult.txStatus]()
      setNpStatus(npStatus)
    } else {
      // tampered. try again
      // FIXME: Nee to figure how to handle
    }
  }
  const useGeneratePaymentToken = useRequest(generatePaymentToken, {
    manual: true,
    onSuccess: (result) => {
      const { cfToken, mode, id } = result
      if (isUndefined(cfToken)) {
        throw new Error('DID_NOT_GET_TOKEN')
      }
      const paramData = {
        orderId: getOrderId(loanId),
        orderAmount: amount,
        appId: config.CASHFREE_APP_ID,
        tokenData: cfToken,
        orderCurrency: 'INR',
        orderNote: `Overdue payment for loan Account ${loanId}`,
        customerPhone: customerDetails.primaryPhone,
        customerEmail: customerDetails.primaryEmail,
        color1: theme['color-primary-default'],
        color2: translations.formatString(translations['payments.for'], { loanId })
      }
      if (mode === METHOD_UPI) {
        paramData.id = id
        paramData.paymentModes = ['upi']
        RNPgReactNativeSdk.startPaymentUPI(paramData, env, handlePaymentCallback)
      } else if (mode === METHOD_WEB) {
        paramData.paymentModes = ['dc', 'nb']
        RNPgReactNativeSdk.startPaymentWEB(paramData, env, handlePaymentCallback)
      }
    },
    onError: (error) => {
      console.log(error)
      throw new Error('CANNOT_CREATE_PAYMENT_TOKEN')
    }
  })
  const { loading, data } = useRequest(() => getUpiChoices())
  if (loading) {
    return <LoadingSpinner />
  }
  const upiChoices = JSON.parse(data)
  upiChoices.forEach(upich => {
    upich.icon = `data:image/png;base64,${upich.icon}`
    upich.mode = METHOD_UPI
  })
  const onPaymentItemSelected = (mode, id) => {
    useGeneratePaymentToken.run(loanId, amount, mode, id)
  }
  const debitCardNetBanking = [
    {
      displayName: 'Debit Card',
      id: 'debitcard',
      Icon: CreditCardIcon,
      mode: METHOD_WEB
    },
    {
      displayName: 'Net Banking',
      id: 'netbanking',
      Icon: NetBankingIcon,
      mode: METHOD_WEB
    }
  ]
  const renderPaymentItem = ({ item }) => {
    const accessoryLeft = (props) => {
      if (item.id !== 'debitcard' && item.id !== 'netbanking') {
        return (
          <View style={styles.iconContainer}>
            {useGeneratePaymentToken.loading ? <Spinner size='tiny' /> : <Image {...props} style={styles.iconStyle} source={{ uri: item.icon }} />}
          </View>
        )
      } else {
        return (
          <View style={styles.iconContainer}>
            {useGeneratePaymentToken.loading ? <Spinner size='tiny' /> : <item.Icon />}
          </View>
        )
      }
    }
    return (
      <ListItem
        title={<Text category='p1' status='info' style={{ marginLeft: 32 }}>{item.displayName}</Text>}
        accessoryLeft={accessoryLeft}
        onPress={() => onPaymentItemSelected(item.mode, item.id)}
      />
    )
  }
  const onCancel = () => navigation.goBack()
  const renderFooter = () => (
    <View style={styles.footerButton}>
      <Button satus='primary' onPress={onCancel}>
        {translations['modal.cancel']}
      </Button>
    </View>
  )
  const renderUpiHeader = () => {
    return (
      <Text category='h6' status='primary'>
        {translations['payments.debitAndNetbanking']}
      </Text>
    )
  }
  const rendeDebitCardrHeader = () => {
    return (
      <Text category='h6' status='primary'>
        {translations['payments.upi']}
      </Text>
    )
  }
  const {
    transactionComplete,
    success,
    tryAgain
  } = npStatus
  const transactionInitiated = !transactionComplete && !success && !tryAgain
  const isSuccess = transactionComplete && success
  const isFailure = transactionComplete && !success && !tryAgain
  const isTryAgain = transactionComplete && !success && tryAgain
  const onRetry = () => {
    setNpStatus({
      transactionComplete: false,
      success: false,
      tryAgain: false
    })
  }
  return (
    <View style={styles.container}>
      <ScreenTitle title={title} description={translations['payment.description']} />
      {transactionInitiated && (
        <>
          <List
            data={debitCardNetBanking}
            contentContainerStyle={styles.contentContainerTop}
            renderItem={renderPaymentItem}
            ItemSeparatorComponent={Divider}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderUpiHeader}
          />
          <List
            style={styles.contentContainer}
            data={upiChoices}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderPaymentItem}
            ItemSeparatorComponent={Divider}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={rendeDebitCardrHeader}
            ListFooterComponentStyle={styles.footer}
          />
          {renderFooter()}
        </>
      )}
      {isSuccess && (
        <PaymentSuccessView />
      )}
      {isFailure && (
        <PaymentFailureView onCancel={onCancel} />
      )}
      {isTryAgain && (
        <PaymentRetryView onRetry={onRetry} onCancel={onCancel} />
      )}
    </View>
  )
}
const themedStyles = StyleService.create({
  footerButton: {
    marginBottom: 16
  },
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-1'

  },
  contentContainerTop: {
    flex: 1,
    backgroundColor: 'background-basic-color-1'
  },
  contentContainer: {
    // flex: 1,
    backgroundColor: 'background-basic-color-1'
  },
  iconStyle: {
    width: 26,
    height: 26
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center'
  },
  footer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginBottom: 16
  }
})
export default Payments
