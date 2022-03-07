import React, { useContext } from 'react'
import { View } from 'react-native'
import { Icon, StyleService, useStyleSheet, Text } from '@ui-kitten/components'
import {
  widthPercentageToDP
} from 'react-native-responsive-screen'
import { LocalizationContext } from '../../components/Translation'

const PaymentSuccessView = () => {
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  return (
    <View>
      <Icon name='checkmark-circle-2-outline' style={styles.iconStyle} />
      <View>
        <Text>
          {translations['repayment.repaySuccess']}
        </Text>
      </View>
    </View>
  )
}
const themedStyles = StyleService.create({
  iconStyle: {
    width: widthPercentageToDP('50%'),
    height: widthPercentageToDP('50%'),
    color: 'color-success-500'
  }
})
export default PaymentSuccessView
