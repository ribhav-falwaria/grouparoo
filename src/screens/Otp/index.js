import React, { useContext, useState } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { View } from 'react-native'
import { useCountDown, useInterval, useRequest, useUpdate } from 'ahooks'
import {
  Text,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import SpinnerButton from '../components/SpinnerButton'
import { LocalizationContext } from '../../components/Translation'
import apiServices from '../../apiService'
import styleConstants from '../styleConstants'
const NUM_RETRIES = 5
const NUM_SEC_WAIT = 60000 // 60 seconds
const OTP_VALID_WINDOW = 300000 // 5 minutes
const padNum = (num, pad) => {
  const str = num.toString()
  return pad.substring(0, pad.length - str.length) + str
}
const sendOtp = async ({ primaryPhone }) => {
  await apiServices.sendOtp({
    primaryPhone
  })
}

const Otp = ({ navigation, route }) => {
  const [counter, setCounter] = useState(NUM_RETRIES)
  const update = useUpdate()
  // const { params } = route
  const { loading, run } = useRequest(() => sendOtp(params), {
    manual: true
  })
  const params = { primaryPhone: 234234234 }
  const onResendOtp = async () => {
    await run(params)
    if (counter > 0) {
      setCounter(counter - 1)
    } else {
      setCounter(0)
    }
    update()
  }
  return (
    <OtpContent
      counter={counter}
      primaryPhone={params.primaryPhone}
      onResendOtp={onResendOtp}
      loading={loading}
    />
  )
}

const OtpContent = ({ counter, primaryPhone, onResendOtp, loading }) => {
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)

  // Run the fet OTP on mount
  // Manage number of retries
  const [isTimeout, setTimeout] = useState(false)
  // Managing countdown of otp validity
  const [countdown, setTargetDate] = useCountDown({
    targetDate: Date.now() + OTP_VALID_WINDOW,
    onEnd: () => setTimeout(true)
  })
  const seconds = parseInt(countdown / 1000)
  const formattedResult = {
    minutes: padNum(parseInt(seconds / 60), '0'),
    seconds: padNum(seconds % 60, '00')
  }
  const waitSeconds = parseInt((OTP_VALID_WINDOW - countdown) / 1000)
  const [disabled, setDisabled] = useState(true)
  useInterval(() => {
    setDisabled(false)
  }, NUM_SEC_WAIT)
  const waitSecondsStr = padNum((NUM_SEC_WAIT / 1000 - waitSeconds), '00')
  // Manage enable resend otp after NUM_SEC_WAIT timeout

  const resendOtp = () => {
    setTimeout(false)
    setDisabled(true)
    setTargetDate(undefined)
    onResendOtp()
  }
  const verifyCode = code => {}
  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <Text style={styles.subHeading} status='primary' category='h6'>
          {translations.formatString(
            translations['otp.sentOtpToMobile'],
            { primaryPhone }
          )}
        </Text>
        <OTPInputView
          style={styles.otp}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={verifyCode}
        />
        <View style={styles.actionRow}>
          <View>
            <Text category='c1' status='primary'>
              {isTimeout === false &&
                translations.formatString(
                  translations['otp.otpTimer'],
                  formattedResult
                )}
              {isTimeout === true && translations['otp.otpTimeout']}
            </Text>
          </View>
          <View>
            <SpinnerButton
              style={styles.actionButton}
              loading={loading}
              appearance='outline'
              disabled={disabled || loading}
              status='primary'
              size='tiny'
              onPress={resendOtp}
            >
              {disabled === true && translations.formatString(translations['otp.waitingFor'], { waitSecondsStr })}
              {disabled === false && translations['otp.resend']}
            </SpinnerButton>
          </View>
        </View>
        <>
          {counter < 5 && (
            <Text appearence='hint' category='c1' status='info'>
              {loading === true && translations['otp.sendingOtp']}
              {loading === false && translations.formatString(translations['otp.sentOtp'], { primaryPhone })}
            </Text>
          )}
        </>
        <Text
          style={styles.content}
          appearence='hint'
          category='s1'
          status={counter <= 2 ? 'warning' : 'basic'}
        >
          {translations.formatString(translations['otp.numberOfRetries'], {
            counter
          })}
        </Text>
      </View>
    </View>
  )
}

const themedStyles = StyleService.create({
  container: {
    ...styleConstants.container,
    flex: 1
  },
  actionRow: {
    paddingVertical: 32,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    marginHorizontal: 16,
    borderRadius: 16
  },
  otpContainer: {
    marginVertical: 200,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  otp: {
    height: 100,
    width: '80%'
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: 'color-primary-300'
  },
  content: {
    ...styleConstants.content
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 3,
    borderBottomWidth: 3,
    borderColor: 'border-basic-color-5',
    color: 'color-primary-500',
    fontSize: 16
  },
  underlineStyleHighLighted: {
    borderColor: 'color-primary-300'
  }
})

export default Otp
