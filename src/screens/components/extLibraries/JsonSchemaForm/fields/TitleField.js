import React, { useContext } from 'react'
import { View } from 'react-native'
import { StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { LocalizationContext } from '../../../../../components/Translation'
const TitleField = ({ title, hasErrors }) => {
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  return (
    <View style={styles.titleContainer}>
      <Text category='p1' appearance='hint'>
        {title}
      </Text>
      {hasErrors === true
        ? (
          <Text category='p1' appearance='default' status='danger'>
            {translations['form.required']}
          </Text>
          )
        : null}
    </View>
  )
}

const themedStyles = StyleService.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
})

export default TitleField
