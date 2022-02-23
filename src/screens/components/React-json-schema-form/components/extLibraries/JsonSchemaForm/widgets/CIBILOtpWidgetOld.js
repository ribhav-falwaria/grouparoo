import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications'
import { useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import isEmpty from 'lodash.isempty'
import { useFormContext } from '..'
import ReactJsonSchemaUtil from '../../../../services/ReactJsonSchemaFormUtil'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import MaskedInput from '../../textMask/text-input-mask'
import DataService from '../../../../services/DataService'
import LoadingSpinner from '../../../../../../components/LoadingSpinner'
import { Text } from '@ui-kitten/components'

let transId
const CIBILOtpWidget = (props) => {
  const [otp, setOtp] = useState()
  const { theme } = useFormContext()
  const currentFormData = useSelector((state) => state?.formDetails?.formData)
  const panData = useSelector((state) => state?.formDetails?.panData)
  const [isFormValid, setIsValid] = useState(true)
  const [loaderVisibility, setLoaderVisibility] = useState(false)
  const toast = useToast()
  const resourceFactoryConstants = new ResourceFactoryConstants()

  const isRequiredFieldPresent = (currentFormData, panData) => {
    if (
      isEmpty(currentFormData) ||
      isEmpty(currentFormData?.primaryPhone) ||
      isEmpty(panData)
    ) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (!props.value && isRequiredFieldPresent(currentFormData, panData)) {
      generateCIBILOtp()
    }
  }, [])

  const getResquestBodyForCIBIL = () => {
    console.log('Form Data at CIBIL Widget', currentFormData)
    const names =
      currentFormData?.fullName?.split(' ') ||
      JSON.parse(panData?.name).name.trim().split(' ') ||
      ''
    const mobileNoWithoutCountryCode = currentFormData?.primaryPhone
    const payload = {
      firstName: names.length > 0 ? names[0] : '',
      middleName: names.length > 2 ? names[1] : '',
      lastName: names.length > 2 ? names[2] : names[1],
      mobileNumber: mobileNoWithoutCountryCode,
      emailAddress: currentFormData?.email || 'nplending@gmail.com',
      dob: ReactJsonSchemaUtil.formatDateToDefaultDate(
        panData?.dob,
        'DD/MM/YYYY',
        'DD-MM-YYYY'
      ),
      idNumber: panData?.panNumber,
      gender: currentFormData?.sex || 'Other',
      addressLine1:
        currentFormData?.residentialAddress?.address2 || 'Bengaluru',
      addressLine2: currentFormData?.residentialAddress?.address2 || '',
      city: currentFormData?.residentialAddress?.city || 'Bengaluru',
      state: currentFormData?.residentialAddress?.state || '29',
      pinCode:
        currentFormData?.residentialAddress?.zipCode?.replace(/ /g, '') ||
        '560103'
    }
    console.log('CIBIL Body Data', payload)
    return payload
  }
  const generateCIBILOtp = () => {
    setLoaderVisibility(true)
    DataService.postData(
      resourceFactoryConstants.constants.cibil.sendOTPForCibil,
      getResquestBodyForCIBIL()
    )
      .then((res) => {
        const data = res.data
        if (data.status === 'SUCCESS') {
          toast.show(data.message, { type: 'success' })
          transId = data.transId
        } else {
          toast.show(data.message || 'Unexpected Error occurred', {
            type: 'error'
          })
        }
        setLoaderVisibility(false)
      })
      .catch((err) => {
        toast.show(err.message, { type: 'danger' })
        setLoaderVisibility(false)
      })
  }
  useEffect(() => {
    if (props.required && (!isEmpty(props.rawErrors) || props.value === '')) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  }, [props.rawErrors, props.value, props.required])

  const onBlurHandler = () => {
    const otp = getTheOtpWithoutMask()
    if (otp.length !== 6) {
      return
    }
    setLoaderVisibility(true)
    DataService.postData(
      resourceFactoryConstants.constants.cibil.verifyCibilOtp,
      {
        transId: transId,
        otp: otp
      }
    )
      .then((res) => {
        const data = res.data
        if (data.status === 'SUCCESS') {
          toast.show('CIBIL Score Verified Successfully', { type: 'success' })
          props.onChange('Yes')
          props.formContext.submit()
        } else {
          toast.show(data.message, { type: 'danger' })
        }
        setLoaderVisibility(false)
      })
      .catch((err) => {
        toast.show(err.message, { type: 'danger' })
        setLoaderVisibility(false)
      })
  }

  const getTheOtpWithoutMask = () => {
    let tempOtp = otp
    if (tempOtp.includes('_')) {
      tempOtp = tempOtp.replace(/_/g, '').trim()
    }
    if (tempOtp.includes(' ')) {
      tempOtp = tempOtp.toString().replace(/ /g, '')
    }
    return tempOtp
  }
  return (
    <View style={styles.rowMargin}>
      <LoadingSpinner visible={loaderVisibility} />
      {!props.value && (
        <MaskedInput
          type='custom'
          options={{
            mask: '9  9  9  9  9  9'
          }}
          includeRawValueInChangeText
          value={otp}
          onChangeText={(text) => setOtp(text)}
          placeholder='1  2  3  4  5  6'
          keyboardType='numeric'
          selectionColor={theme.highlightColor}
          placeholderTextColor={theme.placeholderTextColor}
          status={!isFormValid && 'danger'}
          onBlur={onBlurHandler}
        />
      )}
      {props.value && <Text>CIBIL Score has been verified successfully.</Text>}
    </View>
  )
}

const styles = StyleSheet.create({})

export default CIBILOtpWidget
