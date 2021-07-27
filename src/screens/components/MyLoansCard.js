import React, { useContext } from 'react'
import { View } from 'react-native'
import { useSelector, useStore } from 'react-redux'
import {
  Card,
  Text,
  StyleService,
  useStyleSheet,
  Button
} from '@ui-kitten/components'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from 'rn-placeholder'
import { rupeeFormatter } from '../../utils/'

import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const Loading = () => (
  <Placeholder
    Animation={Fade}
    Left={PlaceholderMedia}
    Right={PlaceholderMedia}
  >
    <PlaceholderLine width={80} />
    <PlaceholderLine />
    <PlaceholderLine width={30} />
    <PlaceholderLine width={30} />
  </Placeholder>
)

const MyLoansCard = ({ loanId, Icon, onPress, loading, heading }) => {
  if (loading) {
    return <Loading />
  }
  const state = useSelector(state => state)
  const store = useStore()
  const selector = store.select((models) => ({
    loanAmount: models.loans.getLoanAmount,
    maturityDate: models.loans.getMaturityDate,
    loanAccountNumber: models.loans.getLoanAccountNumber,
    remainingTenure: models.loans.getRemainingTenure,
    remainingPrincipal: models.loans.getRemainingPrincipal
  }))
  const { loanAmount, loanAccountNumber, maturityDate, remainingTenure, remainingPrincipal } = selector(state, { loanId })
  // const loanAmount = store.select.loans.getLoanAmount(state, loanId)
  // const maturityDate = store.select.loans.getMaturityDate(state, loanId)
  // const loanAccountNumber = store.select.loans.getLoanAccountNumber(
  //   state,
  //   loanId
  // )
  // const remainingTenure = store.select.loans.getRemainingTenure(state, loanId)
  // const remainingPrincipal = store.select.loans.getRemainingPrincipal(
  //   state,
  //   loanId
  // )
  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  const cardHeading = translations.formatString(translations[heading], {
    loanAccountNumber: loanAccountNumber.truncated
  })
  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <View style={styles.cardTitleContainer}>
          <Icon />
          <Text
            style={styles.heading}
            category='h5'
            status='primary'
            appearance='default'
          >
            {cardHeading}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.loanDetailColumn}>
          <Text category='p1' status='default' style={styles.content}>
            {translations['myLoans.loanAmount']}
          </Text>
          <Text category='p1' status='primary'>
            {rupeeFormatter(loanAmount)}
          </Text>
        </View>
        <View style={styles.loanDetailColumn}>
          <Text category='p1' status='default' style={styles.content}>
            {translations['loan.maturityDate']}
          </Text>
          <Text category='p1' status='primary'>
            {`${maturityDate} (${remainingTenure})`}
          </Text>
        </View>
        <View style={styles.loanDetailColumn}>
          <Text category='p1' status='default' style={styles.content}>
            {translations['loan.remainingPrincipal']}
          </Text>
          <Text category='p1' status='primary'>
            {remainingPrincipal}
          </Text>
        </View>
      </View>
    </Card>
  )
}
const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer
  },
  subHeading: {
    ...styleConstants.subHeading
  },
  cardTitleContainer: {
    ...styleConstants.cardTitleContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentContainer: {
    ...styleConstants.contentContainer,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  heading: {
    ...styleConstants.heading
  },
  headingAmount: {
    marginLeft: 'auto'
  },
  content: {
    ...styleConstants.content
  },
  loanDetailColumn: {
    flexDirection: 'column'
  }
})
export default MyLoansCard
