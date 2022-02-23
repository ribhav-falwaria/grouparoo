import React from 'react'
import { View } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from 'rn-placeholder'
import { Card, StyleService, useStyleSheet } from '@ui-kitten/components'
import styleConstants from '../styleConstants'

const Loading = () => (
  <Placeholder Animation={Fade} Left={PlaceholderMedia}>
    <PlaceholderLine width={80} />
    <PlaceholderLine />
    <PlaceholderLine width={30} />
  </Placeholder>
)

const FormattedCardNoHeader = ({ children, loading, ...rest }) => {
  if (loading) {
    return <Loading />
  }
  const styles = useStyleSheet(themedStyles)
  return (
    <Card style={styles.cardContainer} {...rest}>
      <View style={styles.contentContainer}>
        {children}
      </View>
    </Card>
  )
}

const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer,
    margin: 0,
    paddingHorizontal: -4
  },
  contentContainer: {
    ...styleConstants.contentContainer
  }
})

export default FormattedCardNoHeader
