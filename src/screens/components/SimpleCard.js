import React, { useContext } from 'react'
import { View } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from 'rn-placeholder'
import { Card, Text, StyleService, useStyleSheet } from '@ui-kitten/components'
import styleConstants from '../styleConstants'

const Loading = () => (
  <Placeholder Animation={Fade} Left={PlaceholderMedia}>
    <PlaceholderLine width={80} />
    <PlaceholderLine />
    <PlaceholderLine width={30} />
  </Placeholder>
)

const SimpleCard = ({ heading, Icon, content, onPress, loading }) => {
  if (loading) {
    return <Loading />
  }
  const styles = useStyleSheet(themedStyles)
  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <Icon />
        <Text
          style={styles.heading}
          category='h5'
          status='primary'
          appearance='default'
        >
          {heading}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content} category='p1' status='default'>
          {content}
        </Text>
      </View>
    </Card>
  )
}

const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer
  },
  cardTitleContainer: {
    ...styleConstants.cardTitleContainer,
    flexDirection: 'row',
    alignItems: 'center'
  },
  contentContainer: {
    ...styleConstants.contentContainer
  },
  heading: {
    ...styleConstants.heading
  },
  content: {
    ...styleConstants.content
  }
})

export default SimpleCard
