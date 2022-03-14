import React from 'react'
import {
  Text, StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import { View } from 'react-native'

export default ({
  title, description
}) => {
  const styles = useStyleSheet(themedStyles)
  return (
    <View style={styles.heading}>
      <Text category='h3' style={styles.headingText}>{title}</Text>
      <Text style={styles.content} category='s1' apparance='hint'>{description}</Text>
    </View>
  )
}
const themedStyles = StyleService.create({
  heading: {
    marginBottom: 36
  },
  headingText: {
    marginBottom: 4
  }
})
