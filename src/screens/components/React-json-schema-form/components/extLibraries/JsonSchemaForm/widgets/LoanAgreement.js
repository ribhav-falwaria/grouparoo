import { Button, CheckBox, Spinner } from '@ui-kitten/components'
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import isEmpty from 'lodash.isempty'
import { WebView } from 'react-native-webview'
import DownloadComponent from '../common/DownloadComponent'
import { LocalizationContext } from '../../../../translation/Translation'

const LoanAgreementWidget = (props) => {
  const { translations } = useContext(LocalizationContext)
  const { value, rawErrors, required } = props
  const [isValid, setIsValid] = useState()
  useEffect(() => {
    if (!isEmpty(rawErrors)) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  }, [rawErrors, value, required])
  const url =
    props?.schema?.url ||
    'https://www.agstartups.org.br/uploads/2020/07/sample.pdf'
  const [show, setShow] = useState(true)
  return (
    <>
      <View style={styles.container}>
        {show && <Spinner />}
        <WebView
          style={{
            height: Dimensions.get('window').height - 360,
            width: Dimensions.get('window').width
          }}
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${url}`
          }}
          onLoad={() => setShow(false)}
        />
      </View>
      <Button appearance='outline' style={{ marginTop: 6 }}>
        <DownloadComponent fileUrl={url} />
      </Button>
      <CheckBox
        checked={props.value && props.value === 'Yes' ? true : false}
        style={{ marginTop: 5 }}
        onChange={(checked) => props.onChange(checked ? 'Yes' : undefined)}
      >
        {translations['loan.agreement.consent.message']}
      </CheckBox>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15,
    width: '100%'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})

export default LoanAgreementWidget
