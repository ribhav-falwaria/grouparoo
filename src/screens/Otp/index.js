import React, { useState, useEffect, useContext } from 'react'
import { useRequest } from 'ahooks'
import { View } from 'react-native'
import { StyleService, useStyleSheet, Text } from '@ui-kitten/components'
import { LocalizationContext } from '../../components/Translation'
import ScreenTitle from '../components/ScreenTitle'
import apiService from '../../apiService'
import styleConstants from '../styleConstants'
import OtpComponent from '../components/OtpComponent'
const WAIT_FOR_RESEND_MS = 30000 // 30 seconds
const VALID_WINDOW_MS = 300000 // 5 minutes

const generateOtp = async ({ primaryPhone }) => {
  await apiService.sendOtp(primaryPhone)
}
const validateUserOtp = async ({ primaryPhone, otp }) => {
  const response = await apiService.validateOtp(primaryPhone, otp)
  return response
}
const Otp = ({ navigation, route }) => {
  const { translations } = useContext(LocalizationContext)
  const { formData } = route.params
  const title = route.params?.title || translations['auth.otp']
  const [otpValid, setOtpValid] = useState('default')
  const styles = useStyleSheet(themedStyles)
  useEffect(() => {
    if (otpValid === 'valid') {
      formData.isPrimaryPhoneVerified = 'yes'
      formData.isWhatsappNoSameAsPrimaryPhone = 'yes'
      navigation.navigate('SetPassword', { formData })
    }
  })
  const generateOtpRequest = useRequest(() => generateOtp(formData), {
    manual: true
  })
  const validateOtpRequest = useRequest(validateUserOtp, {
    manual: true,
    onSuccess: ({ status }) => status ? setOtpValid('valid') : setOtpValid('invalid')
  })
  const onResendOtp = async () => {
    await generateOtpRequest.run(formData)
    setOtpValid('default')
    // update()
  }
  const onValiateOtp = async (otp) => {
    await validateOtpRequest.run({
      primaryPhone: formData.primaryPhone,
      otp
    })
    // update()
  }
  return (
    <View style={styles.container}>
      <ScreenTitle title={title} description={translations['auth.otp.description']} />
      <OtpComponent
        primaryPhone={formData.primaryPhone}
        onResendOtp={onResendOtp}
        loading={generateOtpRequest.loading || validateOtpRequest.loading}
        onValidateOtp={onValiateOtp}
        otpValid={otpValid}
        otpValidWindow={VALID_WINDOW_MS}
        numSecondsWaitForResend={WAIT_FOR_RESEND_MS}
      />
    </View>
  )
}
const themedStyles = StyleService.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16
    // justifyContent: 'flex-start'
  },
  content: {
    ...styleConstants.content
  }
})
export default Otp
