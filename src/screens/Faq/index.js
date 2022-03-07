import React, { useContext } from 'react'
import { useStore, useSelector } from 'react-redux'
import {
  List,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'

import FaqCard from '../components/FaqCard'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const Faq = props => {
  const { translations } = useContext(LocalizationContext)
  const store = useStore()
  const styles = useStyleSheet(themedStyles)
  const state = useSelector(state => state)
  const selection = store.select(models => ({
    faqs: models.faqs.list
  }))
  const { faqs } = selection(state)
  // If only one Loan
  const onPressFaq = (faq) => {}
  const renderFaqItem = faq => {
    return (
      <FaqCard
        heading={faq.section}
        Icon={faq.icon}
        onPress={() => onPressFaq(faq)}
      />
    )
  }
  return (
    <List
      contentContainerStyle={styles.productList}
      data={faqs}
      numColumns={2}
      renderItem={renderFaqItem}
      showsVerticalScrollIndicator={false}
    />
  )
}
const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2'
  },
  productList: {
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  content: {
    ...styleConstants.content
  },
  subHeading: {
    ...styleConstants.subHeading
  }
})

export default MyLoans
