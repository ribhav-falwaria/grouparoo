const loanTypes = {
  name: 'loanTypes',
  state: [
    {
      id: 1,
      productType: 'shortterm',
      name: 'Insta Loan',
      numberOfLoans: 'one',
      active: true,
      default: true,
      formName: 'termloanform',
      schemaSteps: 'termloanform_mob'
    },
    {
      id: 2,
      productType: 'term',
      name: 'Term Loan',
      active: true,
      numberOfLoans: 'one',
      formName: 'termloanform',
      schemaSteps: 'termloanform_mob'
    },
    {
      id: 3,
      productType: 'creditline',
      name: 'Credit Line',
      numberOfLoans: 'any',
      active: false,
      formName: '',
      schemaSteps: ''
    },
    {
      id: 4,
      productType: 'zerocreditline',
      name: 'Zero Credit Line',
      numberOfLoans: 'any',
      active: false,
      formName: '',
      schemaSteps: ''
    },
    {
      id: 5,
      productType: 'invoicediscounting',
      name: 'Invoice Discounting',
      numberOfLoans: 'any',
      active: false,
      formName: '',
      schemaSteps: ''
    },
    {
      id: 6,
      productType: 'invoicefinancing',
      name: 'Invoice Financing',
      numberOfLoans: 'any',
      active: false,
      formName: '',
      schemaSteps: ''

    },
    {
      id: 7,
      productType: 'sachet',
      name: 'Sachet Loan',
      numberOfLoans: 'one',
      active: false,
      formName: '',
      schemaSteps: ''
    },
    {
      id: 8,
      productType: 'payday',
      name: 'Pay Day Loan',
      numberOfLoans: 'one',
      active: true,
      formName: '',
      schemaSteps: ''
    },
    {
      id: 9,
      productType: 'consumption',
      name: 'Consumption Loan',
      numberOfLoans: 'one',
      active: false,
      formName: '',
      schemaSteps: ''
    },
    {
      id: 10,
      productType: 'personal',
      name: 'Personal Loan',
      numberOfLoans: 'one',
      active: false,
      formName: '',
      schemaSteps: ''
    }
  ],
  selectors: {
    getLoanTypes: (select) => (rootSatate) => {
      return rootSatate.loanTypes
    },
    geActiveLoanTypes: (select) => (rootSatate) => {
      return rootSatate.loanTypes.filter(lt => lt.active)
    },
    getDefaultLoanType: (select) => (rootState) => {
      const defaultLoanType = rootState.loanTypes.find(lt => lt.default)
      return defaultLoanType
    },
    getLoanTypeForApplicationId: (select) => (rootState, { loanApplicationId }) => {
      const loanApplication = select.loanApplications.getById(rootState, loanApplicationId)
      if (loanApplication) {
        return rootState.loanTypes.find(lt => lt.id === loanApplication.loanTypeId)
      } else {
        return {}
      }
    }
  }
}
export default loanTypes
