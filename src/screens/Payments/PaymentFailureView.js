import React, { useContext } from 'react'
import { View } from 'react-native'
import { Icon, StyleService, useStyleSheet, Text, Button } from '@ui-kitten/components'
import { LocalizationContext } from '../../components/Translation'
import {
  widthPercentageToDP
} from 'react-native-responsive-screen'
const PaymentFailureView = ({ onCancel }) => {
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  return (
    <View>
      <Icon name='close-circle-outline' style={styles.iconStyle} />
      <View>
        <Text>
          {translations['repayment.repayFailed']}
        </Text>
      </View>
      <View>
        <Button
          onPress={onCancel}
        >
          {translations['repayment.tryLater']}
        </Button>
      </View>
    </View>
  )
}
const themedStyles = StyleService.create({
  iconStyle: {
    width: widthPercentageToDP('50%'),
    height: widthPercentageToDP('50%'),
    color: 'color-danger-500'
  }
})
export default PaymentFailureView
