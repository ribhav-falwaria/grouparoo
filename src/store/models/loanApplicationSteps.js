import orderBy from 'lodash.orderby'
const loanApplicationSteps = {
  name: 'loanApplicationSteps',
  state: [
    {
      order: 0,
      title: 'application.form.title',
      completeTitle: 'application.form.complete',
      action: 'application.form.action'
    },
    {
      order: 1,
      title: 'application.cpv.title',
      completeTitle: 'application.cpv.complete',
      action: 'application.cpv.action'
    },
    {
      order: 2,
      title: 'application.credit.title',
      completeTitle: 'application.credit.complete',
      action: 'application.credit.action'
    },
    {
      order: 3,
      title: 'application.coborrower.title',
      completeTitle: 'application.coborrower.complete',
      action: 'application.coborrower.action'
    },
    {
      order: 4,
      title: 'application.kyc.title',
      completeTitle: 'application.kyc.complete',
      action: 'application.kyc.action'
    }
  ],
  selectors: {
    getLoanApplicationSteps: () => rootState => {
      return orderBy(rootState.loanApplicationSteps, ['order'], ['asc'])
    },
    getCurrentStep: select => (rootState, { loanApplicationId }) => {
      return {
        step: loanApplicationSteps[3],
        index: 3
      }
    }
  },
  effects: {},
  reducers: {}
}
export default loanApplicationSteps
