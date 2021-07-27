import React, { useContext } from 'react'
import { useStore, useSelector, useDispatch } from 'react-redux'
import { useRequest } from 'ahooks'
import { List, StyleService, useStyleSheet } from '@ui-kitten/components'
import BlockCard from '../components/BlockCard'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'
import { AllIcons } from '../components/ThemedIcons'
import offers from '../../store/models/offers'

const renderHorizontalOfferItem = ({ item }) => {
  return (
    <BlockCard
      loading={item.loading}
      heading={item.title}
      Icon={AllIcons[item.icon]}
      content={item.content}
      onPress={() => item.onPress(item)}
    />
  )
}

const getOffers = async (dispatch, { customer }) => {
  return dispatch.offers.getAsync(customer)
}
const HorizontalListOffers = ({ navigation }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const state = useSelector(state => state)
  const { loading } = useRequest(() => getOffers(dispatch, state))
  const onPress = (item) => {
    // Navigate to the screen provided in Item
  }
  const offers = store.select.offers.list(state)
  const styles = useStyleSheet(themedStyles)
  offers.forEach(o => {
    o.onPress = onPress
  })
  return (
    <List
      contentContainerStyle={styles.horizontalList}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={loading ? Array(3).fill({ loading }) : offers}
      renderItem={renderHorizontalOfferItem}
    />
  )
}

const themedStyles = StyleService.create({})

export default HorizontalListOffers
