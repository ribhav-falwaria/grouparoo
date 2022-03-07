import React, { useContext } from 'react'
import { View } from 'react-native'
import { Icon, Button, StyleService, useStyleSheet, Text } from '@ui-kitten/components'
import {
  widthPercentageToDP
} from 'react-native-responsive-screen'
import { LocalizationContext } from '../../components/Translation'

const PaymentFailureView = ({ onRetry, onCancel }) => {
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)
  return (
    <View>
      <Icon name='alert-circle-outline' style={styles.iconStyle} />
      <Text>
        {translations['repayment.repayTryAgain']}
      </Text>
      <Button onPress={onRetry}>
        {translations['repayment.tryAgain']}
      </Button>
      <Button onPress={onCancel}>
        {translations['modeal.cancel']}
      </Button>
    </View>
  )
}
const themedStyles = StyleService.create({
  iconStyle: {
    width: widthPercentageToDP('50%'),
    height: widthPercentageToDP('50%'),
    color: 'color-warning-500'
  }
})
export default PaymentFailureView
