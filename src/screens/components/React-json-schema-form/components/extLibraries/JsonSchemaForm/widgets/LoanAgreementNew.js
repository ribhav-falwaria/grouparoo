import { Button, CheckBox, Spinner, Text } from '@ui-kitten/components'
import React, { Fragment, useState } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import Pdf from 'react-native-pdf'
import DownloadComponent from '../common/DownloadComponent'
import { useWhyDidYouUpdate } from 'ahooks'

const LoanAgreementWidget = (props) => {
  useWhyDidYouUpdate('Loan Agreement', { ...props })
  props.onChange('Yes')
  const url =
    props?.schema?.url ||
    'https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf'
  const [currentPage, setCurrentPage] = useState({})
  console.log(Dimensions.get('window').height - 275)
  const onPageChange = (page, numberOfPages) => {
    setCurrentPage({ page, numberOfPages })
  }
  const onLoadComplete = ({ numberOfPages }) => {
    setCurrentPage({ page: 1, numberOfPages })
  }
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text category='label'>
            {currentPage.page ? `${currentPage.page} of ${currentPage.numberOfPages}` : ''}
          </Text>
        </View>
        <Pdf
          source={{ uri: url }}
          onLoadComplete={onLoadComplete}
          style={styles.pdf}
          onPageChange={onPageChange}
          renderActivityIndicator={(progress) => <Spinner />}
        />
      </View>
      <CheckBox checked style={{ marginTop: 5 }}>
        I accept the agreement.
      </CheckBox>
      <Button appearance='outline' style={{ marginTop: 6 }}>
        <DownloadComponent
          fileUrl={url}
        />
      </Button>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})

export default LoanAgreementWidget
