import React from 'react'
import { Text } from '@ui-kitten/components'

const FormLabel = ({ content }) => {
  return (
    <Text appearance='hint' category='p1'>
      {content}
    </Text>
  )
}
export default FormLabel
