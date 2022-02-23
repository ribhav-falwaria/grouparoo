import React, { useContext, useState } from 'react'
import { useRequest } from 'ahooks'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { Text } from '@ui-kitten/components'
import isEmpty from 'lodash.isempty'
import Toast from 'react-native-toast-message'
import { LocalizationContext } from '../../../../translation/Translation'
import DocumentUploadService from '../../../../services/DocumentUploadService'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import DocumentPicker from 'react-native-document-picker'
import DataService from '../../../../services/DataService'
import DocumentUploadComponent from '../common/DocumentUploadComponent'

const getNewFileAdded = (newFiles, oldFiles = []) => {
  if (newFiles.length === 0) {
    return []
  }
  if (oldFiles.length === 0) {
    return newFiles
  }
  const addedFiles = []
  newFiles.forEach(file => {
    if (!oldFiles.some((of) => of.uri === file.uri)) {
      addedFiles.push(file)
    }
  })
  return addedFiles
}

const uploadITR = async (dispatch, files) => {
  // Code to upload bank Statement
  const resourceFactoryConstants = new ResourceFactoryConstants()
  const url = resourceFactoryConstants.constants.bankStatement.uploadBankStatement
  const formData = new FormData()
  for (const file of files) {
    formData.append('file', file)
  }
  try {
    const res = await DataService.postData(url, formData)
    const responseData = res.data
    const uploadedDocIds = []
    if (responseData.status === 'SUCCESS') {
      for (let r = 0; r < files.length; r++) {
        const docDetails = await uploadToAppWrite(files[r])
        uploadedDocIds.push(`${docDetails.uploadedDocId}'::'${docDetails.uploadedFileName}`)
      }
      files.forEach(file => {
        file.uploading = false
      })
      await dispatch.formDetails.setIsBankStatementVerified('Yes')
      await dispatch.formDetails.setItrFiles(files)

      return { uploadedDocIds }
    } else {
      throw new Error('INVALID_ITR_STATEMENT')
    }
  } catch (e) {
    console.log(e)
    throw new Error('CANNOT_REACH_ITR_VALIDATION_SERVICE')
  }
}
const uploadToAppWrite = async (file) => {
  const documentUploadService = new DocumentUploadService()
  if (isEmpty(file)) {
    return
  }
  try {
    const res = await documentUploadService.uploadFileToAppWrite(file)
    const responseData = res.data
    if (responseData.status === 'SUCCESS') {
      return {
        uploadedDocId: responseData.fileId,
        uploadedFileName: file.name
      }
    } else {
      console.log(responseData)
      throw new Error('UPLOAD_ITR_TO_DOC_SERVER_FAILED')
    }
  } catch (err) {
    console.log(err)
    throw new Error('CANNOT_REACH_ITR_UPLOAD_SERVER')
  }
}
const ITRUploadField = (props) => {
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const store = useStore()
  // need a copy of bank statement files and not direct reference to state
  const itrFiles = store.select.formDetails.getItrFiles(state)
  const itrFilesCopy = JSON.parse(JSON.stringify(itrFiles))

  const [isUploadDone, setIsUploadDone] = useState(false)
  const { translations } = useContext(LocalizationContext)
  const useRemoveFile = useRequest((file) => dispatch.formDetails.removeItrFiles(file), {
    manual: true
  })
  const uploadFiles = useRequest(uploadITR, {
    manual: true,
    onSuccess: (result, params) => {
      const { uploadedDocIds } = result
      const allUploadedDocIds = props.value ? [...props.value, ...uploadedDocIds] : uploadedDocIds
      props.onChange(allUploadedDocIds)
      setIsUploadDone(true)
      Toast.show({
        type: 'success',
        position: 'bottom',
        visibilityTime: 2000,
        props: {
          title: translations['itr.title'],
          description: translations['itr.success']
        }
      })
    },
    onError: (error, params) => {
      console.log(error)
      setIsUploadDone(true)
      if (error.message === 'CANNOT_REACH_ITR_VALIDATION_SERVICE' ||
        error.message === 'CANNOT_REACH_ITR_UPLOAD_SERVER'
      ) {
        throw error
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          props: {
            title: translations['itr.title'],
            description: translations['itr.failed']
          }
        })
      }
    }
  })
  const removeFile = (file) => {
    if (!isEmpty(file) > 0) {
      useRemoveFile.run(file)
      // remove from props
      const newProps = props.value.filter(v => v.indexOf(file.name) > -1)
      props.onChange([...newProps])
    }
  }

  const onFileChange = (allFiles) => {
    setIsUploadDone(false)
    const newFilesAdded = getNewFileAdded(allFiles, itrFiles)
    if (newFilesAdded.length > 0) {
      uploadFiles.run(dispatch, newFilesAdded)
    }
  }
  return (
    <>
      <Text appearance='hint' category='label'>
        {props.schema.title}
      </Text>
      <DocumentUploadComponent
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        multiple
        files={itrFilesCopy}
        type={[DocumentPicker.types.pdf]}
        loading={uploadFiles.loading}
        selectText={translations['itr.uploadText']}
        removeFile={removeFile}

      />
      <Text appearance='hint' category='label' status='info'>
        {props.schema.description}
      </Text>
    </>
  )
}
export default ITRUploadField
