import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import isUndefined from 'lodash.isundefined'
import MaskedInput from '../../textMask/text-input-mask'
import Toast from 'react-native-toast-message'
import { useFormContext } from '../FormContext'
import { Text, Spinner } from '@ui-kitten/components'
import isEmpty from 'lodash.isempty'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import DataService from '../../../../services/DataService'
import { LocalizationContext } from '../../../../translation/Translation'
import IconUtil from '../../../common/IconUtil'

const validateUdyam = async (dispatch, udyam) => {
  const resourseFactoryConstants = new ResourceFactoryConstants()
  const url = `${resourseFactoryConstants.constants.udyam.verifyUdyamAadhar}${udyam}`
  try {
    const res = await DataService.getData(url)
    const response = res?.data
    if (response.status === 'SUCCESS') {
      await Promise.all([
        dispatch.formDetails.setUdyamData(response.data),
        dispatch.formDetails.setIsUdyamVerified('Yes')
      ])
      return {
        udyam
      }
    } else {
      console.log(response.message)
      throw new Error('UDYAM_AADHAR_VALIDATION_FAILED')
    }
  } catch (e) {
    if (e.message === 'UDYAM_AADHAR_VALIDATION_FAILED') {
      throw e
    } else {
      throw new Error('CANNOT_REACH_UDYAM_VALIDATION_SERVER')
    }
  }
}
const stripPrefix = (udyamPrefix, value) => {
  if (!isUndefined(value)) {
    const udyam = value.replace(`${udyamPrefix}-`, '').replace('-', '').trim()
    return udyam
  }
}
const UdyamAadharInputWidget = ({
  id,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  placeholder,
  options,
  multiline,
  secureEntry,
  schema,
  textContentType = 'none',
  rawErrors = [],
  required
}) => {
  const { theme } = useFormContext()
  const hasErrors = rawErrors.length > 0
  const [invalid, setInvalid] = useState(false)
  const { translations } = useContext(LocalizationContext)
  const udyamPrefix = 'UDYAM'
  const [udyamAadhar, setUdyamAadhar] = useState(stripPrefix(value) || '')
  const dispatch = useDispatch()
  const getTickMark = () => {
    if (!value) {
      if (useValidateUdyam.loading) {
        return (<Spinner />)
      } else if (invalid) {
        return <IconUtil.ErrorIcon />
      } else {
        return null
      }
    } else {
      return (
        <IconUtil.CheckIcon />
      )
    }
  }
  const useValidateUdyam = useRequest(validateUdyam, {
    manual: true,
    onError: (error) => {
      setInvalid(true)
      onChange(undefined)
      if (error.message === 'CANNOT_REACH_UDYAM_VALIDATION_SERVER') {
        throw error
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          visibilityTime: 2000,
          props: {
            title: translations['udyam.title'],
            description: translations['udyam.failed']
          }
        })
      }
    },
    onSuccess: (result) => {
      setInvalid(false)
      onChange(result.udyam)
      Toast.show({
        type: 'success',
        position: 'bottom',
        props: {
          title: translations['udyam.title'],
          description: translations['udyam.success']
        }
      })
    }
  })
  const onUdyamChangeHandler = (udyam) => {
    setUdyamAadhar(udyam);
    const tempUdyam = udyamPrefix + '-' + udyam
    if (isEmpty(tempUdyam) || (tempUdyam && tempUdyam.length !== 19)) {
      return
    }
    useValidateUdyam.run(dispatch, tempUdyam)
  }

  return (
    <>
      <MaskedInput
        type='custom'
        options={{
          mask: 'AA-99-9999999',
          translations: {
            '-': (val) => {
              if (val === '-') {
                return '-'
              }
              return null
            }
          }
        }}
        includeRawValueInChangeText
        multiline={multiline}
        placeholder={placeholder || 'XX-12-1234567'}
        autoFocus={autofocus}
        editable={!disabled && !readonly}
        keyboardType='visible-password'
        value={udyamAadhar}
        secureTextEntry={secureEntry}
        textContentType={textContentType}
        onChangeText={(newText) => onUdyamChangeHandler(newText)}
        // onBlur={onBlurTextHandler}
        onFocus={() => {
          onFocus(id, value)
        }}
        selectionColor={theme.highlightColor}
        placeholderTextColor={theme.placeholderTextColor}
        status={hasErrors && 'danger'}
        accessoryRight={() => getTickMark()}
        accessoryLeft={() => <Text>{udyamPrefix}</Text>}
      />
    </>
  )
}

export default UdyamAadharInputWidget
