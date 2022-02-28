import React, { useState, useContext } from 'react'
import { Text } from '@ui-kitten/components'
import { useDispatch, useSelector } from 'react-redux'
import { useRequest } from 'ahooks'
import Toast from 'react-native-toast-message'
import isUndefined from 'lodash.isundefined'
import isEmpty from 'lodash.isempty'
import { LocalizationContext } from '../../../../translation/Translation'

import DataService from '../../../../services/DataService'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import IconUtil from '../../../common/IconUtil'
import ImageUploadComponent from '../common/ImageUploadComponent'
import OKYCComponent from '../common/OKYCComponent'

const uploadFileForFaceMatch = async (dispatch, file, docface) => {
  const resourceFactoryConstants = new ResourceFactoryConstants()
  const url = resourceFactoryConstants.constants.kyc.getUrlForFaceMatch
  const formData = new FormData()
  formData.append('file', file)
  formData.append('doc_face', docface)
  try {
    const res = await DataService.postData(url, formData)
    if (res.data.status === 'SUCCESS') {
      await dispatch.formDetails.setOkycSelfieFile(file)
      return true
    } else {
      console.log(res.data.message)
      throw new Error('FACE_MATCH_FAILED')
    }
  } catch (e) {
    if (e.message === 'FACE_MATCH_FAILED') {
      throw e
    } else {
      throw new Error('CANNOT_REACH_FACE_MATCH_SERVER')
    }
  }
}

const OKYCWidget = (props) => {
  const dispatch = useDispatch()
  const { translations } = useContext(LocalizationContext)
  const {
    okycSelfieFile,
    kycData
  } = useSelector(state => ({
    selfieFile: state.formDetails.selfieFile,
    kycData: state.formDetails.kycData
  }))
  const [isUploadDone, setIsUploadDone] = useState(!isEmpty(okycSelfieFile))
  const hasError = isUndefined(props.rawErrors) ? 0 : props.rawErrors.length > 0
  const [isKycDone, setIsKycDone] = useState(false)
  const [isAadharDataFetched, setIsAadharDataFetched] = useState(false)
  const useRemoveFile = useRequest(() => dispatch.formDetails.setOkycSelfieFile(undefined), {
    manual: true
  })
  const useSaveAdhaarData = useRequest((kycData) => dispatch.formDetails.setaadharData(kycData), {
    manual: true
  })
  const onOtpSuccessHandler = (kycData) => {
    setIsAadharDataFetched(true)
    useSaveAdhaarData.run(kycData)
  }
  const useFaceMatch = useRequest(uploadFileForFaceMatch, {
    manual: true,
    onSuccess: () => {
      props.onChange('Yes')
      setIsKycDone(true)
      setIsUploadDone(true)
      Toast.show({
        type: 'success',
        position: 'bottom',
        props: {
          title: translations['okyc.facematch.title'],
          description: translations['okyc.facematch.success']
        }
      })
    },
    onError: (error) => {
      console.log(error)
      setIsUploadDone(true)
      if (error.message === 'FACE_MATCH_FAILED') {
        throw error
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          props: {
            title: translations['okyc.facematch.title'],
            description: translations['okyc.facematch.failed']
          }
        })
      }
    }
  })
  const removeFile = (uri) => {
    if (uri.length > 0) {
      useRemoveFile.run()
      // remove from props
      props.onChange(undefined)
      setIsUploadDone(false)
    }
  }
  const onFileChange = (data) => {
    setIsUploadDone(false)
    const fileDetails = {
      uri: data.uri,
      type: data.type,
      name: 'selfie.jpg'
    }
    const docface = kycData?.data?.doc_face
    if (!isUndefined(docface) || !isEmpty(docface)) {
      useFaceMatch.run(dispatch, fileDetails, docface)
    }
  }
  return (
    <>
      {!isAadharDataFetched && !props.value && (
        <OKYCComponent onOtpSuccess={onOtpSuccessHandler} />
      )}
      {isAadharDataFetched && (
        <>
          <ImageUploadComponent
            hasError={hasError}
            isUploadDone={isUploadDone}
            onFileChange={onFileChange}
            uris={okycSelfieFile ? [okycSelfieFile.uri] : []}
            loading={useFaceMatch.loading}
            selectText={translations['okyc.selfie.uploadText']}
            removeFile={removeFile}
          />
        </>
      )}
      {(isKycDone || props.value === 'Yes') && (
        <Text>
          {translations['okyc.facematch.success']}
          <IconUtil.CheckMark
            style={{ marginLeft: 8 }}
          />
        </Text>
      )}
    </>
  )
}
export default OKYCWidget
