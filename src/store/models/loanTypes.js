import apiService from '../../apiService'

const loanTypes = {
  name: 'loanTypes',
  state: [
  ],
  selectors: {
    getDisplayName: (select) => (rootState, { loanTypeId }) => {
      return rootState.loanTypes[loanTypeId].name
    },
    getLoanTypes: (select) => (rootState) => {
      const loanTypes = rootState.loanTypes
      return loanTypes
    },
    getDefaultLoanType: (select) => (rootState) => {
      return rootState.loanTypes.defaultLoanType
    },
    getLoanTypeForApplicationId: (select) => (rootState, { loanApplicationId }) => {
      const loanApplication = select.loanApplications.getById(rootState, loanApplicationId)
      if (loanApplication && loanApplication.loanType) {
        return rootState.loanTypes[loanApplication.loanType]
      } else {
        return {}
      }
    }
  },
  reducers: {
    setLoanTypes: (state, { loanTypes }) => {
      loanTypes.forEach(lt => {
        if (lt.active) {
          state[lt.productType] = lt
          if (lt.default) {
            state.defaultLoanType = lt
          }
        }
      })
      return state
    }
  },
  effects: dispatch => ({
    async getAllLoanTypes (_, rootState) {
      const loanTypes = await apiService.appApi.loanTypes.getAll()
      dispatch.loanTypes.setLoanTypes({ loanTypes })
    }
  })
}
export default loanTypes
