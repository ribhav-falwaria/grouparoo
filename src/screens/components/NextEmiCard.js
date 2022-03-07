import React, { useContext } from 'react'
import { View } from 'react-native'
import { useStore, useSelector } from 'react-redux'
import {
  Card,
  Text,
  StyleService,
  useStyleSheet
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

const RepaymentCard = ({ heading, loanId, Icon, onPress, onPaymentPress, loading }) => {
  if (loading) {
    return <Loading />
  }
  const store = useStore()
  const state = useSelector(state => state)
  const selector = store.select(models => ({
    productName: models.loans.getProductName,
    loanAccountNumber: models.loans.getLoanAccountNumber,
    nextInstallment: models.loans.getNextInstallment
  }))
  const { nextInstallment, loanAccountNumber } = selector(state, {
    loanId
  })

  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  const isRepayNow = nextInstallment.pastDueDays > 0
  // Nothing to show cuase the borrower is in dpd
  if (isRepayNow) {
    return null
  }
  return (
    <Card style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardTitleContainer}>
        <View style={styles.cardTitleContainer}>
          <Icon />
          <Text
            category='h6'
            status='primary'
            appearance='default'
          >
            {translations[heading]}
          </Text>
        </View>
        <View>
          <Text
            category='h6'
            status='primary'
            appearance='default'
          >
            <Text category='p1' status='basic'>{'₹ '}</Text>
            {rupeeFormatter(nextInstallment.total)}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content} category='p1' appearance='hint'>
          {`${translations['loan.loanAccountNumber']} : `}
        </Text>
        <Text category='s1'>
          {loanAccountNumber}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content} category='p1' appearance='hint'>
          {`${translations['repayment.installmentDate']} : `}
        </Text>
        <Text category='s1'>
          {`${nextInstallment.installmentDate}  (${nextInstallment.humanize})`}
        </Text>
      </View>
    </Card>
  )
}
const themedStyles = StyleService.create({
  cardContainer: {
    ...styleConstants.cardContainer
  },
  headRow: {
    marginBottom: 12
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
    alignItems: 'center'
  },
  heading: {
    ...styleConstants.heading
  },
  subHeading: {
    ...styleConstants.subHeading
  },
  headingAmount: {
    marginLeft: 'auto'
  },
  content: {
    ...styleConstants.content
  },
  rowContent: {
    ...styleConstants.content,
    width: 100
  },
  repaymentSchedule: {
    flexDirection: 'column',
    alignItems: 'baseline'
  },
  scheduleRowHead: {
    flexDirection: 'row',
    marginBottom: 4
  },

  scheduleRow: {
    flexDirection: 'row'
  },
  payNow: {
    marginLeft: 'auto',
    width: 150
  }
})

export default RepaymentCard
