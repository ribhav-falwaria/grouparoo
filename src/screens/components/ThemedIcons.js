import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme, Icon } from '@ui-kitten/components'
import styleConstants from '../styleConstants'

import MyLoanSvg from '../../assets/images/monetization_on_black_24dp'
import RepaySvg from '../../assets/images/payments_black_24dp'
import ReferralSvg from '../../assets/images/auto_awesome_black_24dp.svg'
import OfferSvg from '../../assets/images/verified_black_24dp'
const buildIcon = (IconSvg) => {
  const theme = useTheme()
  return (
    <View style={styles.iconStyle}>
      <IconSvg fill={theme['color-warning-300']} width={26} height={26} />
    </View>
  )
}
const buildEvaIcon = (name, fill, width, height) => {
  const theme = useTheme()
  return (
    <Icon name={name} style={{ marginRight: 4 }} fill={fill || theme['color-warning-300']} width={width || 26} height={height || 26} />
  )
}
export const MyLoansIcon = () => buildIcon(MyLoanSvg)
export const RepaymentIcon = () => buildIcon(RepaySvg)
export const ReferralIcon = () => buildIcon(ReferralSvg)
export const LoanAgentIcon = () => buildEvaIcon('award-outline')
export const OfferIcon = () => buildIcon(OfferSvg)
export const ApplicationFormIcon = () => buildEvaIcon('file-text-outline')
export const SignInIcon = () => buildEvaIcon('log-in-outline')
export const SignUpIcon = () => buildEvaIcon('person-add-outline')
export const ForgotPasswordIcon = () => buildEvaIcon('unlock-outline')
export const CheckedIconSteps = () => buildEvaIcon('checkmark-outline', '#ffffff', 20, 20)
export const CheckIcon = () => {
  const theme = useTheme()
  return buildEvaIcon('checkmark-circle-outline', theme['color-success-500'], 16, 16)
}
export const CancelIcon = () => {
  const theme = useTheme()
  return buildEvaIcon('close-circle-outline', theme['color-danger-500'], 16, 16)
}
export const CancelIconForm = (props) => {
  return <Icon name='close-outline' {...props} />
}
export const HomeIcon = () => buildEvaIcon('home')


// export const RepaymentIcon = () => buildEvaIcon('flip-outline')
const styles = StyleSheet.create({
  iconStyle: {
    ...styleConstants.iconStyle
  }
})

export const AllIcons = {
  MyLoansIcon,
  RepaymentIcon,
  ReferralIcon,
  LoanAgentIcon,
  OfferIcon,
  ApplicationFormIcon,
  HomeIcon
}
