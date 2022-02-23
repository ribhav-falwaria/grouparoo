import { Button, Text } from '@ui-kitten/components'
import React, { Fragment, useEffect, useState } from 'react'
import { Alert, Linking } from 'react-native'
import { useToast } from 'react-native-toast-notifications'
import DataService from '../../../../services/DataService'
import ResourceFactoryConstants from '../../../../services/ResourceFactoryConstants'
import IconUtil from '../../../common/IconUtil'
import RNFetchBlob from 'rn-fetch-blob'
import LoadingSpinner from '../../../../../../components/LoadingSpinner'
const EsignInputWidget = (props) => {
  const toast = useToast()
  const resourceFactoryConstants = new ResourceFactoryConstants()
  const [loaderVisibility, setLoaderVisibility] = useState(false)
  const [isEsignDone, setIsEsignDone] = useState(!!props.value)
  const [file, setFile] = useState('')
  const [appUrl, setAppUrl] = useState(null)

  const fileUrl =
    props?.schema?.url ||
    'https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf'

  useEffect(async () => {
    const initialUrl = await Linking.getInitialURL()
    console.log('Initial Url is:==========================>', initialUrl)
    setAppUrl(initialUrl || 'novopay://com.novoloan.customerapp/open')
    Linking.addEventListener('url', handleUrl)
  }, [])

  const handleUrl = (event) => {
    let temp = false
    const returnUrl = event.url
    const paramString = returnUrl.split('?')[1]
    const queryString = new URLSearchParams(paramString)
    for (const pair of queryString.entries()) {
      if (pair[0] === 'esign_status' && pair[1] === 'success') {
        setIsEsignDone(true)
        props.onChange('Yes')
        temp = true
      }
    }
    if (!temp) {
      toast.show('Unexpected error occurred. Please try again', {
        type: 'danger'
      })
    }
  }

  useEffect(() => {
    DataService.getDataV1(fileUrl, { responseType: 'blob' })
      .then((response) => {
        if (response.status === 200 && response.data) {
          const reader = new FileReader()
          reader.readAsDataURL(response.data)
          reader.onloadend = function () {
            const base64data = reader.result
            setFile(base64data.split(',')[1])
          }
        } else {
          console.error('Error occurred while fetching loan agreement file')
        }
      })
      .catch((err) => {
        console.error('Error occurred while fetching loan agreement file', err)
      })
  }, [])

  const openLink = async (esignUrl) => {
    const supported = await Linking.canOpenURL(esignUrl)
    if (supported) {
      await Linking.openURL(esignUrl)
    } else {
      Alert.alert(`Don't know how to open this URL: ${esignUrl}`)
    }
  }

  const esignProcessHandler = () => {
    if (!appUrl) {
      console.error('App Url is not defined')
      return
    }
    setLoaderVisibility(true)
    RNFetchBlob.fetch(
      'POST',
      resourceFactoryConstants.constants.eSign.uploadPdfForeSign,
      {
        'Content-Type': 'multipart/form-data'
      },
      [
        { name: 'file', filename: 'agreement', data: file },
        { name: 'page_no', data: '1' },
        {
          name: 'redirect_url',
          data: encodeURIComponent(appUrl)
        }
      ]
    )
      .then((res) => {
        if (res.respInfo.status === 200) {
          const data = JSON.parse(res.data)
          if (data.status === 'Uploaded Document') {
            const esignUrl = data.url
            Alert.alert(
              'Information',
              'Redirecting to e-sign website to complete esign process',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    openLink(esignUrl)
                  }
                }
              ]
            )
          } else {
            console.err(
              'Upload Failed while uploading to veri5Digital with message',
              data.status
            )
          }
        } else {
          console.err(
            'Upload Failed while uploading to veri5Digital with status code',
            res.respInfo.status
          )
        }
        setLoaderVisibility(false)
      })
      .catch((err) => {
        toast.show(err.status, { type: 'danger' })
        setLoaderVisibility(false)
      })
  }
  return (
    <>
      <LoadingSpinner visible={loaderVisibility} />
      {!isEsignDone && (
        <Button
          appearance='outline'
          status='primary'
          onPress={esignProcessHandler}
          style={{ marginTop: 5 }}
        >
          Start Esign Process
        </Button>
      )}
      {isEsignDone && (
        <Text
          appearance='default'
          status='primary'
          style={{ marginTop: 5, fontWeight: 'bold' }}
        >
          ESign has been done successfully.{' '}
          <IconUtil.CheckIcon
            size={20}
            color='green'
            style={{ marginLeft: 5 }}
          />
        </Text>
      )}
    </>
  )
}

export default EsignInputWidget
