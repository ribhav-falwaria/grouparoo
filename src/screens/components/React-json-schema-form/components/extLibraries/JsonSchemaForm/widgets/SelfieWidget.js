import { StyleService, Text } from '@ui-kitten/components'
import React, { useContext, useState } from 'react'
import { useRequest } from 'ahooks'
import Toast from 'react-native-toast-message'
import isUndefined from 'lodash.isundefined'
import isEmpty from 'lodash.isempty'
import { useDispatch } from 'react-redux'
import { LocalizationContext } from '../../../../translation/Translation'
import DocumentUploadService from '../../../../services/DocumentUploadService'
import ImageUploadComponent from '../common/ImageUploadComponent'
import ReactJsonSchemaUtil from '../../../../services/ReactJsonSchemaFormUtil'
import DownloadComponent from '../common/DownloadComponent'

const uploadToAppWrite = async (file) => {
  const documentUploadService = new DocumentUploadService()
  if (isEmpty(file)) {
    return
  }
  const uploadedFileName = ReactJsonSchemaUtil.getFileName(file).join('::')
  try {
    const res = await documentUploadService.uploadFileToAppWrite(file)
    const responseData = res.data
    if (responseData.status === 'SUCCESS') {
      return {
        uploadedDocId: responseData.fileId,
        uploadedFileName
      }
    } else {
      console.log(responseData)
      throw new Error('UPLOAD_SELFIE_TO_DOC_SERVER_FAILED')
    }
  } catch (err) {
    console.log(err)
    if (err.message === 'UPLOAD_SELFIE_TO_DOC_SERVER_FAILED') {
      throw err
    } else {
      throw new Error('CANNOT_REACH_SELFIE_UPLOAD_SERVER')
    }
  }
}

const uploadFileToServer = async (dispatch, file) => {
  if (isEmpty(file)) {
    return
  }
  const docDetails = await uploadToAppWrite(file)
  const uploadedDocId = `${docDetails.uploadedDocId}'::'${docDetails.uploadedFileName}`
  return uploadedDocId
}

const SelfieWidget = (props) => {
  const hasError = isUndefined(props.rawErrors) ? 0 : props.rawErrors.length > 0
  const [isUploadDone, setIsUploadDone] = useState(false)
  const { translations } = useContext(LocalizationContext)
  const dispatch = useDispatch()
  const uploadFile = useRequest(uploadFileToServer, {
    manual: true,
    onSuccess: (results, params) => {
      const { uploadedDocIds } = results
      props.onChange(uploadedDocIds)
      setIsUploadDone(true)
      Toast.show({
        type: 'success',
        position: 'bottom',
        visibilityTime: 2000,
        props: {
          title: translations['selfie.title'],
          description: translations['selfie.success']
        }
      })
    },
    onError: (error, params) => {
      console.log(error)
      if (error.message === 'CANNOT_REACH_SELFIE_UPLOAD_SERVER') {
        throw error
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          props: {
            title: translations['selfie.title'],
            description: translations['selfie.failed']
          }
        })
      }
    }
  })
  let docId, fileName
  if (props.value) {
    const tempArr = props.value.split('::')
    docId = tempArr[0]
    fileName = tempArr[1]
  }

  const onFileChange = (data) => {
    setIsUploadDone(false)
    const fileDetails = {
      uri: data.uri,
      type: data.type,
      name: 'panCard.jpg'
    }
    uploadFile.run(dispatch, fileDetails)
  }
  return (
    <>
      {props.value && (
        <>
          <Text style={styles.text} status='success'>
            Sussessfully Uploaded
          </Text>
          <DownloadComponent fileUrl={fileName} uploadedDocId={docId} />
        </>
      )}
      <ImageUploadComponent
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        useFrontCamera={false}
        hasError={hasError}
        selectText={translations['selfie.uploadText']}
        loading={uploadFile.loading}
      />
    </>
  )
}
const styles = StyleService.create({
  text: {
    margin: 4
  }
})
export default SelfieWidget
