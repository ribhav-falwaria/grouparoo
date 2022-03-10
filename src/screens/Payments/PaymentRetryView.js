import React, { useContext } from 'react'
import { View } from 'react-native'
import { Button, StyleService, useStyleSheet, Text } from '@ui-kitten/components'
import { LocalizationContext } from '../../components/Translation'
import { PaymentRetryIcon } from '../components/ThemedIcons'
const PaymentRetryView = ({ onRetry, onCancel }) => {
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <PaymentRetryIcon />
        <Text category='h6'>
          {translations['repayment.repayTryAgain']}
        </Text>
      </View>

      <View>
        <View style={{ marginTop: 16 }}>
          <Button onPress={onRetry}>
            {translations['repayment.tryAgain']}
          </Button>
        </View>
        <View style={{ marginTop: 16 }}>
          <Button onPress={onCancel} appearance='ghost'>
            {translations['modal.cancel']}
          </Button>
        </View>
      </View>
    </View>
  )
}
const themedStyles = StyleService.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.8
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})
export default PaymentRetryView
