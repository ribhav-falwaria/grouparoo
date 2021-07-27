import React, { useContext } from 'react'
import {
  Text,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import styleConstants from '../../../../styleConstants'
import { LocalizationContext } from '../../../../../components/Translation'

const DescriptionField = ({ description }) => {
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  if (description) {
    return (
      <Text
        style={styles.content} category='p1' status='default'
      >
        {description}
      </Text>
    )
  }
  return null
}

const themedStyles = StyleService.create({
  content: {
    ...styleConstants.content
  }
})

export default DescriptionField
