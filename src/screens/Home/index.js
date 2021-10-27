import React, { useContext } from 'react'
import { useStore, useSelector, useDispatch } from 'react-redux'
import { View } from 'react-native'
import { useRequest } from 'ahooks'
import { List, Text, StyleService, useStyleSheet } from '@ui-kitten/components'
import styleConstants from '../styleConstants'
import { LocalizationContext } from '../../components/Translation'
import SimpleCard from '../components/SimpleCard'
import HorizontalListOffer from '../components/HorizontalListOffers'
import RepaymentCard from '../components/RepaymentCard'
import PendingLoanApplications from '../components/PendingLoanApplications'
import MyLoansCard from '../components/MyLoansCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { AllIcons } from '../components/ThemedIcons'

const HomeListComponents = {
  SimpleCard,
  RepaymentCard,
  PendingLoanApplications,
  MyLoansCard
}
const getHomeData = async (dispatch, { customer }) => {
  return Promise.all([
    dispatch.loans.getAsync(customer),
    dispatch.loanApplications.getAsync(customer)
  ])
}

const HomeScreen = ({ navigation, route }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const { loading } = useRequest(() => getHomeData(dispatch, state))
  const selection = store.select(models => ({
    customer: models.customer.getCustomer,
    loans: models.loans.getActiveLoans,
    loanApplications: models.loanApplications.getActiveLoanApplications,
    homeListItems: models.homeListItems.getHomeListItems
  }))

  const { loans, loanApplications, customer, homeListItems } = selection(state)

  const styles = useStyleSheet(themedStyles)
  const { translations } = useContext(LocalizationContext)

  if (loading) {
    return <LoadingSpinner />
  }
  const localeText = {
    hello: translations.formatString(translations['hello!'], customer),
    subHeading: translations['app.title']
  }
  const processPayment = (item, loan) => {}
  const renderHeader = () => (
    <>
      <View style={styles.section}>
        <Text
          style={styles.heading}
          category='h4'
          appearance='default'
          status='primary'
        >
          {`${localeText.hello}`}
        </Text>
        <Text
          style={styles.subHeading}
          category='s1'
          appearance='default'
          status='default'
        >
          {localeText.subHeading}
        </Text>
      </View>
    </>
  )

  const renderVerticalItems = ({ item }) => {
    const Component = HomeListComponents[item.component]
    if (item.name === 'MyLoans') {
      if (loans.length > 0) {
        return loans.map((loan, ix) => (
          <Component
            key={`myloanscard-${ix}`}
            loanId={loan.id}
            Icon={AllIcons[item.icon]}
            onPress={() => item.onPress(item)}
            heading={item.heading}
          />
        ))
      }
    } else if (item.name === 'PendingApplications') {
      if (loanApplications.length > 0) {
        return loanApplications.map((loanApplication, ix) => (
          <Component
            key={`pendingapplication-${ix}`}
            loanApplicationId={loanApplication.id}
            Icon={AllIcons[item.icon]}
            onPress={() => item.onPress(item)}
            heading={item.heading}
          />
        ))
      }
    } else if (item.name === 'RepaymentsPending') {
      if (loans.length > 0) {
        return loans.map((loan, ix) => (
          <Component
            loanId={loan.id}
            key={`repayment-${ix}`}
            onPress={() => item.onPress(item, loan)}
            onPaymentPress={() => processPayment(item)}
            Icon={AllIcons[item.icon]}
            heading={item.heading}
          />
        ))
      }
    } else if (item.name === 'Offers') {
      return <HorizontalListOffer />
    }
  }

  const handleOnPress = item => {
    if (item.name === 'RepaymentsPending') {
      navigation.navigate('Repayments', { loans })
    } else if (item.name === 'PendingApplications') {
      navigation.navigate('LoanApplication', { loanApplications })
    } else if (item.name === 'MyLoans') {
      navigation.navigate('MyLoans', { loans })
    }
  }
  homeListItems.forEach(hl => {
    hl.onPress = handleOnPress
  })

  return (
    <List
      style={styles.container}
      contentContainerStyle={styles.list}
      data={homeListItems}
      renderItem={renderVerticalItems}
      ListHeaderComponent={renderHeader}
    />
  )
}

const themedStyles = StyleService.create({
  container: {
    flex: 1
  },
  list: {
    // flexDirection: 'column',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // height: 'auto',
    // marginTop: 'auto'
  },
  heading: {
    ...styleConstants.heading
  },
  subHeading: {
    ...styleConstants.subHeading
  },
  section: {
    ...styleConstants.section,
    flexDirection: 'column'
  }
})

export default HomeScreen
