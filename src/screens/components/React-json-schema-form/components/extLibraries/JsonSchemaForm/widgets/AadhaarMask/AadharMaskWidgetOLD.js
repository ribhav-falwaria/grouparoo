import { StyleService, Text } from '@ui-kitten/components'
import React, { useContext, useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications'
import RNFetchBlob from 'rn-fetch-blob'
import DocumentPicker from 'react-native-document-picker'

import DocumentUploadService from '../../../../services/DocumentUploadService'
import { LocalizationContext } from '../../../../translation/Translation'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import DataService from '../../../../services/DataService'
import DocumentUploadComponent from './common/DocumentUploadComponent'
import isEmpty from 'lodash.isempty'
import DownloadComponent from './common/DownloadComponent'
import ReactJsonSchemaUtil from '../../../../services/ReactJsonSchemaFormUtil'

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
      throw new Error('UPLOAD_STATEMENT_TO_DOC_SERVER_FAILED')
    }
  } catch (err) {
    console.log(err)
    if (err.message === 'UPLOAD_STATEMENT_TO_DOC_SERVER_FAILED') {
      throw err
    } else {
      throw new Error('CANNOT_REACH_STATEMENT_UPLOAD_SERVER')
    }
  }
}

const AadharMaskWidget = (props) => {
  const FRONT_SIDE = 'front-side-aadhar-masked.jpeg'
  const BACK_SIDE = 'back-side-aadhar-masked.jpeg'
  const toast = useToast()
  const [isUploadDone, setIsUploadDone] = useState(false)
  const { translations } = useContext(LocalizationContext)
  const [files, setFiles] = useState([])
  const resourceFactoryConstants = new ResourceFactoryConstants()
  const [loaderVisibility, setLoaderVisibility] = useState(false)
  const [maskedFront, setMaskedFront] = useState('')
  const [maskedBack, setMaskedBack] = useState('')
  let ids
  if (props.value) {
    ids = props.value.split('::')
  }
  const [uploadedIds, setUploadedIds] = useState(ids ? [ids[0], ids[1]] : [])

  const onAadharUploadHandler = () => {
    if (isEmpty(files)) {
      return
    }
    setLoaderVisibility(true)
    const url =
      resourceFactoryConstants.constants.aadharMask.uploadAadharWithFronAndBack
    DataService.postData(url, getFormData())
      .then(async (res) => {
        const responseData = res.data
        if (responseData.status === 'SUCCESS') {
          setMaskedFront(responseData?.maskedFront)
          setMaskedBack(responseData?.maskedBack)
          uploadFileUsingRNFetchBlob(maskedFront, maskedBack)
        } else {
          toast.show(translations['common.error'], { type: 'danger' })
          setLoaderVisibility(false)
        }
      })
      .catch((err) => {
        toast.show(err.message, { type: 'danger' })
        setLoaderVisibility(false)
      })
  }

  const uploadFileUsingRNFetchBlob = (base64, fileName) => {
    RNFetchBlob.fetch(
      'POST',
      resourceFactoryConstants.constants.lending.uploadFile,
      { 'Content-Type': 'multipart/form-data' },
      [{ name: 'file', filename: fileName, data: base64 }]
    )
      .then((res) => {
        const data = JSON.parse(res.data)
        if (data.status === 'SUCCESS') {
          setUploadedIds((prev) => {
            const temp = JSON.parse(JSON.stringify(prev))
            temp.push(data.fileId)
            return temp
          })
        }
      })
      .catch((err) => {
        console.log(fileName, err)
        setLoaderVisibility(false)
      })
  }

  const getFormData = () => {
    const formData = new FormData()
    for (const file of files) {
      formData.append('file', file)
    }
    return formData
  }

  useEffect(() => {
    if (maskedBack) {
      uploadFileUsingRNFetchBlob(maskedBack, BACK_SIDE)
    }
  }, [maskedBack])

  useEffect(() => {
    if (maskedFront) {
      uploadFileUsingRNFetchBlob(maskedFront, FRONT_SIDE)
    }
  }, [maskedFront])

  useEffect(() => {
    if (uploadedIds && uploadedIds.length === 2 && !props.value) {
      props.onChange(
        uploadedIds.join('::') + '::' + FRONT_SIDE + '::' + BACK_SIDE
      )
      toast.show(translations['Upload.successfully'], { type: 'success' })
      setLoaderVisibility(false)
      setIsUploadDone(true)
    }
  }, [uploadedIds])
  const onFileChange = (data) => {
    if (data.length !== 2) {
      toast.show('Only two files are allowed', { type: 'danger' })
      return
    }
    setIsUploadDone(false)
    setFiles(data)
  }

  return (
    <>
      {props.value && (
        <>
          <Text style={styles.text} status='success'>
            Sussessfully Uploaded.
          </Text>
          {/* <TouchableOpacity onPress={saveFileIntoFileSystem}>
            <Text status="primary">Download</Text>
          </TouchableOpacity> */}
          <DownloadComponent
            fileUrl={FRONT_SIDE}
            uploadedDocId={uploadedIds[0]}
          />
        </>
      )}
      <DocumentUploadComponent
        isUploadDone={isUploadDone}
        onFileChange={onFileChange}
        onUploadHandler={onAadharUploadHandler}
        multiple // as of now, saving one file
        type={[DocumentPicker.types.images]}
        value={props.value}
        loading={loaderVisibility}
      />
    </>
  )
}
const styles = StyleService.create({
  text: {
    margin: 4
  }
})
export default AadharMaskWidget
