import React, { useContext } from 'react'
import AadhaarMaskWidget from './AadhaarMaskWidget'
import { LocalizationContext } from '../../../../../translation/Translation'

const FRONT_SIDE = 'front-side-aadhar-masked.jpeg'
const BACK_SIDE = 'back-side-aadhar-masked.jpeg'
export const AadhaarMaskWidgetFront = (props) => {
  const { translations } = useContext(LocalizationContext)
  return (
    <AadhaarMaskWidget
      {...props}
      fileName={FRONT_SIDE}
      selectText={translations['aadhar.uploadFrontSide']}
    />
  )
}
export const AadhaarMaskWidgetBack = (props) => {
  const { translations } = useContext(LocalizationContext)
  return (
    <AadhaarMaskWidget
      {...props}
      isBack
      fileName={BACK_SIDE}
      selectText={translations['aadhar.uploadBackSide']}
    />
  )
}
