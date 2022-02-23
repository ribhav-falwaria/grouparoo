import React from 'react'
import { View } from 'react-native'
import DescriptionField from './DescriptionField'
import RootTitleField from './RootTitleField'
import { StyleService, useStyleSheet } from '@ui-kitten/components'
import TitleDescriptionField from './TitleDescriptionField'
const ObjectFieldTemplate = ({
  description,
  title,
  properties,
  required,
  uiSchema
}) => {
  const styles = useStyleSheet(themedStyles)
  return (
    <View>
      <View style={styles.formTitleContainer}>
        {uiSchema['ui:title'] || title ? (
          <RootTitleField title={title} required={required} />
        ) : null}
        {description ? <TitleDescriptionField description={description} /> : null}
      </View>
      <View style={styles.contentContainer}>
        {properties.map((element, index) => (
          <View key={index}>{element.content}</View>
        ))}
      </View>
    </View>
  )
}
const themedStyles = StyleService.create({
  formTitleContainer: {
    marginBottom: 16
  },
  contentContainer: {
    marginVertical: 8
  }
})

export default ObjectFieldTemplate
