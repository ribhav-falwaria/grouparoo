import React, { useContext } from 'react'
import { useStore, useSelector } from 'react-redux'
import {
  List,
  StyleService,
  Text,
  useStyleSheet
} from '@ui-kitten/components'

import MyLoan from './MyLoan'
import BlockCard from '../components/BlockCard'
import { MyLoansIcon } from '../components/ThemedIcons'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const MyLoans = props => {
  const { loanId } = props
  if (loanId) {
    return <MyLoan {...props} loanId={loanId} />
  }
  const { translations } = useContext(LocalizationContext)
  const store = useStore()
  const styles = useStyleSheet(themedStyles)
  const state = useSelector(state => state)
  const selection = store.select(models => ({
    customer: models.customer.getCustomer,
    loans: models.loans.getActiveLoans
  }))
  const { loans, customer } = selection(state)
  // If only one Loan
  if (loans.length === 1) {
    return <MyLoan {...props} loanId={loans[0].id} />
  }
  if (loans.length === 0) {
    // Apply for new Loan
  }
  const onPressLoanItem = loan => {
    // Navigate to my loan page
  }
  const renderLoanItem = loan => {
    const loanSelection = store.select(models => ({
      loanAmount: models.loans.getLoanAmount,
      maturityDate: models.loans.getMaturityDate,
      disbursementDate: models.loan.getDisbursementDate,
      loanAccountNumber: models.loans.getLoanAccountNumber
    }))
    const {
      loanAmount,
      maturityDate,
      disbursementDate,
      loanAccountNumber
    } = loanSelection(state, { loanId: loan.loanId })
    const Content = () => (
      <>
        <Text style={styles.content} category='p1' status='default'>
          {translations['myLoans.loanAmount']}
        </Text>
        <Text style={styles.subHeading} category='s1' status='default'>
          {loanAmount}
        </Text>
        <Text style={styles.content} category='p1' status='default'>
          {translations['loan.maturityDate']}
        </Text>
        <Text style={styles.subHeading} category='s1' status='default'>
          {maturityDate}
        </Text>
      </>
    )
    return (
      <BlockCard
        heading={loanAccountNumber}
        Icon={MyLoansIcon}
        onPress={() => onPressLoanItem(loan)}
        content={Content}
      />
    )
  }
  return (
    <List
      contentContainerStyle={styles.productList}
      data={loans}
      numColumns={2}
      renderItem={renderLoanItem}
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
