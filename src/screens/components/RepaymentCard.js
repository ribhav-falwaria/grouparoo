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
    dpdSchedule: models.loans.getDpdSchedule,
    productName: models.loans.getProductName,
    loanAccountNumber: models.loans.getLoanAccountNumber
  }))
  const { dpdSchedule, productName, loanAccountNumber } = selector(state, {
    loanId
  })

  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)
  const totalRepaymentAmount = dpdSchedule.reduce((v, r) => {
    v = v + r.amount
    return v
  }, 0)
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
            {translations[heading]}
          </Text>
        </View>
        <View>
          <Text
            style={styles.heading}
            category='h5'
            status='primary'
            appearance='default'
          >
            {rupeeFormatter(totalRepaymentAmount)}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content} category='p1'>
          {`${translations['loan.loanAccountNumber']} : `}
        </Text>
        <Text style={styles.subHeading} category='s1'>
          {loanAccountNumber.truncated}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.repaymentSchedule}>
          <View>
            <View style={styles.scheduleRowHead}>
              <Text category='p1' status='default' style={styles.rowContent}>
                {translations['repayment.installment']}
              </Text>
              <Text category='p1' status='default' style={styles.rowContent}>
                {translations['repayment.overdue']}
              </Text>
            </View>
            {dpdSchedule.map((schedule, ix) => (
              <View key={`schedule-${ix}`} style={styles.scheduleRow}>
                <Text category='p1' status='default' style={styles.rowContent}>
                  {schedule.dueDate}
                </Text>
                <Text category='p1' status='danger' style={styles.scheduleText}>
                  {rupeeFormatter(schedule.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.payNow}>
          <Button onPress={onPaymentPress}>{translations['pay.now']}</Button>
        </View>
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
