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
  // const useRemoveFile = useRequest(() => dispatch.formDetails.setOkycSelfieFile(undefined), {
  //   manual: true
  // })
  const useSaveAdhaarData = useRequest((kycData) => dispatch.formDetails.setaadharData(kycData), {
    manual: true
  })
  const onOtpSuccessHandler = (kycData) => {
    props.onChange('Yes')
    setIsKycDone(true)
    useSaveAdhaarData.run(kycData)
  }
  
  return (
    <>
      {!isAadharDataFetched && !props.value && (
        <OKYCComponent onOtpSuccess={onOtpSuccessHandler} />
      )}
      {/* {isAadharDataFetched && (
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
      )} */}
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
