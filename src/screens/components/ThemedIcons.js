import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme, Icon } from '@ui-kitten/components'
import styleConstants from '../styleConstants'

import MyLoanSvg from '../../assets/images/monetization_on_black_24dp'
import RepaySvg from '../../assets/images/payments_black_24dp'
import ReferralSvg from '../../assets/images/auto_awesome_black_24dp.svg'
import OfferSvg from '../../assets/images/verified_black_24dp'
import RupeeIconSvg from '../../assets/images/rupee-symbol.svg'
import BankIconSvg from '../../assets/images/account_balance_black_24dp.svg'
const buildIcon = (IconSvg) => {
  const theme = useTheme()
  return (
    <View style={styles.iconStyle}>
      <IconSvg fill={theme['color-warning-500']} width={26} height={26} />
    </View>
  )
}
const buildEvaIcon = (name, fill, width, height) => {
  const theme = useTheme()
  return (
    <Icon name={name} style={{ marginRight: 4 }} fill={fill || theme['color-warning-500']} width={width || 26} height={height || 26} />
  )
}

export const NoInternetIcon = () => buildEvaIcon('wifi-off-outline', undefined, 36, 36)
export const SmsIcon = () => buildEvaIcon('message-circle-outline')
export const DeviceIcon = () => buildEvaIcon('smartphone-outline')
export const CameraIcon = () => buildEvaIcon('video-outline')
export const ContactListIcon = () => buildEvaIcon('list-outline')
export const LocationIcon = () => buildEvaIcon('pin-outline')

export const MyLoansIcon = () => buildIcon(MyLoanSvg)
export const NetBankingIcon = () => buildIcon(BankIconSvg)
export const RepaymentIcon = () => buildIcon(RepaySvg)
export const ReferralIcon = () => buildIcon(ReferralSvg)
export const LoanAgentIcon = () => buildEvaIcon('award-outline')
export const OfferIcon = () => buildIcon(OfferSvg)
export const LoanOfferIcon = () => buildEvaIcon('bookmark-outline')
export const ApplicationFormIcon = () => buildEvaIcon('file-text-outline')
export const AppPermissionsIcon = () => buildEvaIcon('checkmark-square-outline')
export const CreditCardIcon = () => buildEvaIcon('credit-card-outline')

export const ManageLoanApplicationsIcon = () => buildEvaIcon('list-outline')
export const SignInIcon = () => buildEvaIcon('log-in-outline')
export const SignUpIcon = () => buildEvaIcon('person-add-outline')
export const EditIcon = () => buildEvaIcon('edit-outline')
export const ForgotPasswordIcon = () => buildEvaIcon('unlock-outline')
export const CheckedIconSteps = () => buildEvaIcon('checkmark-outline', '#ffffff', 20, 20)
export const WarningIcon = () => {
  const theme = useTheme()
  return buildEvaIcon('alert-triangle-outline', theme['color-danger-default'])
}
export const InfoIcon = () => {
  const theme = useTheme()
  return buildEvaIcon('info-outline', theme['color-info-default'])
}
export const CheckIconGreen = () => {
  const theme = useTheme()
  return buildEvaIcon('checkmark-outline', theme['color-success-default'])
}
export const SuccessIcon = CheckIconGreen

export const CheckIconSmall = () => {
  const theme = useTheme()
  return buildEvaIcon('checkmark-circle-outline', theme['color-success-default'], 16, 16)
}
export const CancelIcon = () => {
  const theme = useTheme()
  return buildEvaIcon('close-circle-outline', theme['color-danger-default'], 16, 16)
}
export const CancelIconForm = (props) => {
  return <Icon name='close-outline' {...props} />
}
export const HomeIcon = () => buildEvaIcon('home')

export const LoanApplicationIcon = () => buildEvaIcon('file-text-outline')
// export const RepaymentIcon = () => buildEvaIcon('flip-outline')
const styles = StyleSheet.create({
  iconStyle: {
    ...styleConstants.iconStyle
  }
})
// Form Icons
const buildFormIcons = (name) => {
  const theme = useTheme()
  return buildEvaIcon(name, theme['color-basic-600'], 24, 24)
}
const FormEmailIcon = (name) => buildFormIcons('email-outline')
const FormMobileIcon = (name) => buildFormIcons('smartphone-outline')
const FormNameIcon = (name) => buildFormIcons('person-outline')

export const FormIcons = {
  FormEmailIcon,
  FormMobileIcon,
  FormNameIcon
}
export const AllIcons = {
  MyLoansIcon,
  RepaymentIcon,
  ReferralIcon,
  LoanAgentIcon,
  OfferIcon,
  ApplicationFormIcon,
  HomeIcon,
  SmsIcon,
  CameraIcon,
  LocationIcon,
  ContactListIcon,
  DeviceIcon
}

export const CreditCheckIcon = () => buildEvaIcon('checkmark-circle-outline')
export const DocumentsIcon = () => buildEvaIcon('grid-outline')
export const SalesAgentIcon = () => buildEvaIcon('people-outline')
export const AcceptOfferIcon = () => buildEvaIcon('done-all-outline')
const CheckedItemIcon = () => buildEvaIcon('checkmark-circle-2-outline', undefined, 16, 16)
export const LoanApplicationHelpIcons = {
  CreditCheckIcon,
  DocumentsIcon,
  SalesAgentIcon,
  AcceptOfferIcon,
  CheckedItemIcon
}

const IconUnselected = () => {
  const theme = useTheme()
  return buildEvaIcon('radio-button-off-outline', theme['color-basic-400'], 32, 32)
}
const IconSelected = () => {
  const theme = useTheme()
  return buildEvaIcon('checkmark-circle-2', theme['color-primary-900'], 32, 32)
}
export const LoanOfferIcons = {
  IconUnselected,
  IconSelected
}
