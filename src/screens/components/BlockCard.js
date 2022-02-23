import React, { useContext } from 'react'
import { View } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from 'rn-placeholder'

import { Card, Text, StyleService, useStyleSheet } from '@ui-kitten/components'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const Loading = () => (
  <Placeholder Animation={Fade} Left={PlaceholderMedia}>
    <PlaceholderLine width={80} />
    <PlaceholderLine />
    <PlaceholderLine width={30} />
  </Placeholder>
)

const BlockCard = ({ heading, Icon, Content, onPress, loading }) => {
  if (loading) {
    return <Loading />
  }
  const isTextContent = typeof Content === 'string'
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
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
          {translations[heading]}
        </Text>
      </View>
      {isTextContent === true && (
        <View style={styles.contentContainer}>
          <Text style={styles.content} category='p1' status='default'>
            {translations[Content]}
          </Text>
        </View>
      )}
      {isTextContent === false && <Content />}
    </Card>
  )
}

const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer,
    ...styleConstants.blockCard
  },
  cardTitleContainer: {
    ...styleConstants.cardTitleContainer,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  contentContainer: {
    marginVertical: 8
  },
  heading: {
    ...styleConstants.heading
  },
  content: {
    ...styleConstants.content
  }
})

export default BlockCard
