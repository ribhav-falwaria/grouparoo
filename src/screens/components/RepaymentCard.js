import React, { useContext } from 'react'
import { View } from 'react-native'
import { useStore, useSelector } from 'react-redux'
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
import RupeeText from './RupeeText'

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
    nextInstallment: models.loans.getNextInstallment,
    dpdSchedule: models.loans.getDpdSchedule
  }))
  const { nextInstallment, dpdSchedule, productName, loanAccountNumber } = selector(state, {
    loanId
  })

  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  const isRepayNow = nextInstallment.pastDueDays > 0

  const onPayPress = () => {
    // FIXME: Need to change this after use case from nishant
    onPaymentPress(loanId, 1000)
  }
  // Nothing to repay - no dpd
  if (!isRepayNow) {
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
        <View style={styles.repaymentSchedule}>
          <View>
            <View style={styles.scheduleRowHead}>
              <View>
                <Text category='p1' status='default' style={styles.rowContent}>
                  {translations['repayment.installment']}
                </Text>
              </View>
              <View>
                <Text category='p1' status='default' style={styles.rowContent}>
                  {translations['repayment.overdue']}
                </Text>
              </View>
            </View>
            {dpdSchedule.display.map((display, ix) => (
              <View key={`schedule-${ix}`} style={styles.scheduleRow}>
                <View>
                  <Text category='p1' status='default' style={styles.rowContent}>
                    {display.installmentDate}
                  </Text>
                </View>
                <View>
                  <Text category='s1' status='danger' style={styles.scheduleText}>
                    <RupeeText />
                    {display.installmentAmount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.payNow}>
        <Button onPress={onPayPress}>{translations['pay.now']}</Button>
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
    marginBottom: 4,
    justifyContent: 'space-between'
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  payNow: {
    width: '100%'
  }
})

export default RepaymentCard
