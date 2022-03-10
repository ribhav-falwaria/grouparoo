import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { useStore, useSelector } from 'react-redux'
import {
  List,
  StyleService,
  Text,
  useStyleSheet
} from '@ui-kitten/components'
import ScreenTitle from '../components/ScreenTitle'
import MyLoanCard from '../components/MyLoansCard'
import MyLoan from './MyLoan'
import { MyLoansIcon } from '../components/ThemedIcons'
import { LocalizationContext } from '../../components/Translation'
import styleConstants from '../styleConstants'

const MyLoans = props => {
  const { loanId } = props.route.params
  if (loanId) {
    return <MyLoan {...props} loanId={loanId} />
  }
  const { translations } = useContext(LocalizationContext)
  const title = props.route.params?.title || translations['myLoans.title']
  const store = useStore()
  const styles = useStyleSheet(themedStyles)
  const state = useSelector(state => state)
  const [selectedLoanId, setSelectedLoanId] = useState()
  const selection = store.select(models => ({
    customer: models.customer.getCustomer,
    loans: models.loans.getActiveLoans
  }))
  const { loans, customer } = selection(state)
  // If only one Loan
  if (loans.length === 1) {
    return <MyLoan {...props} loanId={loans[0].loanApplicationId} />
  }
  if (loans.length === 0) {
    // Apply for new Loan
  }
  const onPressLoanItem = loan => {
    setSelectedLoanId(loan.loanId)
    // Navigate to my loan page
  }
  const renderLoanItem = ({ item }) => {
    return (
      <View style={styles.blockCardStyle}>
        <MyLoanCard
          loanId={item.loanId}
          Icon={MyLoansIcon}
          onPress={() => onPressLoanItem(item)}
          heading='myLoans.cardTitle'
        />
      </View>
    )
  }
  const renderListHeader = () => (
    <ScreenTitle
      title={title}
    />
  )
  if (selectedLoanId && selectedLoanId.length > 0) {
    return (
      <MyLoan {...props} loanId={selectedLoanId} />
    )
  }
  return (
    <List
      contentContainerStyle={styles.productList}
      data={loans}
      renderItem={renderLoanItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderListHeader}
    />
  )
}
const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2'
  },
  blockCardStyle: {
    marginLeft: 8,
    marginBottom: 16
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
