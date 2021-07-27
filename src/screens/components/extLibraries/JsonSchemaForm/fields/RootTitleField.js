import React, { useContext } from 'react'
import { Text } from '@ui-kitten/components'
const RootTitleField = ({ title }) => {
  return (
      <Text category='h5' status='primary' appearence='default'>
        {title}
      </Text>
  )
}

export default RootTitleField
