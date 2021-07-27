import orderBy from 'lodash.orderby'
const homeListItems = {
  name: 'homeListItems',
  state: [
    {
      order: 2,
      name: 'MyLoans',
      component: 'MyLoansCard',
      icon: 'MyLoansIcon',
      heading: 'myLoans.cardTitle',
      content: 'myLoans.content',
      navigate: 'Loans'
    },
    {
      order: 3,
      name: 'PendingApplications',
      component: 'PendingLoanApplications',
      icon: 'ApplicationFormIcon',
      heading: 'pendingLoanApplication.title',
      content: 'pendingLoanApplication.content',
      navigate: 'ApplicationsList'
    },
    {
      order: 1,
      name: 'RepaymentsPending',
      component: 'RepaymentCard',
      icon: 'RepaymentIcon',
      heading: 'repayment.overdueTitle',
      content: 'repayment.content',
      navigate: 'Repayments'
    },
    {
      order: 4,
      name: 'Offers',
      component: 'HorizontalListOffer'
    }
  ],
  selectors: {
    getHomeListItems: () => rootState => {
      return orderBy(rootState.homeListItems, ['order'], ['asc'])
    }
  }
}
export default homeListItems
