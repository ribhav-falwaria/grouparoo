import React, { useContext } from 'react'
import { View } from 'react-native'
import {
  Text,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import styleConstants from '../../../../styleConstants'
import { LocalizationContext } from '../../../../translation/Translation'

const DescriptionField = ({ description }) => {
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  if (description) {
    return (
      <View style={styles.container}>
        <Text
          category='label'
          status='info'
        >
          {description}
        </Text>
      </View>
    )
  }
  return null
}

const themedStyles = StyleService.create({
  content: {
    ...styleConstants.content,
    marginTop: 4
  }
})

export default DescriptionField
