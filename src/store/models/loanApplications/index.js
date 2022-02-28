import dayjs from 'dayjs'
import isEmpty from 'lodash.isempty'
import isUndefined from 'lodash.isundefined'
import apiService from '../../../apiService'

const addLoanApplications = (state, { loanApplications }) => {
  if (!isEmpty(loanApplications)) {
    const activeLoanApplicationIds = []
    if (!isUndefined(loanApplications)) {
      loanApplications.forEach(la => {
        state.applications[la.loanApplicationId] = la
        if (la.status === 'ACTIVE') {
          activeLoanApplicationIds.push(la.loanApplicationId)
        }
      })
      if (loanApplications.length === 1) {
        state.currentLoanApplicationId = loanApplications[0].loanApplicationId
      }
      state.activeLoanApplicationIds = activeLoanApplicationIds
      return state
    }
    return state
  }
  return state
}
const loanApplications = {
  name: 'loanApplications',
  state: {
    activeLoanApplicationIds: [],
    currentLoanApplicationId: undefined,
    applications: {}
  },
  selectors: {
    getCurrentLoanApplication: select => (rootState) => {
      const loanApplications = rootState.loanApplications
      if (!isUndefined(loanApplications.currentLoanApplicationId)) {
        const loanApplication = loanApplications.applications[loanApplications.currentLoanApplicationId]
        return loanApplication
      }
    },
    hasAnyLoanApplication: select => (rootState) => {
      return !isEmpty(rootState.loanApplications.applications)
    },
    getApplicationById: select => (rootState, { id }) => {
      const loanApplication = rootState.loanApplications.applications[id]
      return loanApplication
    },
    getActiveLoanApplications: select => rootState => {
      const activeLoanApplicationIds = rootState.loanApplications.activeLoanApplicationIds
      return activeLoanApplicationIds.map(aid => rootState.loanApplications.applications[aid])
    },
    getAllLoanApplications: select => rootState => {
      return Object.keys(rootState.loanApplications.applications).map(ky => rootState.loanApplications.applications[ky])
    },
    getLoanAmount: select => (rootState, { loanApplicationId }) => {
      return rootState.loanApplications.applications[loanApplicationId].loanAmount
    },
    getStartDate: select => (rootState, { loanApplicationId }) => {
      const createdAt = rootState.loanApplications.applications[loanApplicationId].createdOn
      return dayjs(createdAt).format('DD-MMM-YYYY')
    },
    getLoanDetailsForApplication: select => (rootState, { loanApplicationId }) => {
      const loanApplication = rootState.loanApplications.application[loanApplicationId]
      const loan = select.loans.getLoanById({
        loanApplicationId: loanApplication.loanApplicationId
      })
      return loan
    }
  },
  reducers: {
    // Called only while registering or signing in. Server has the true data
    'customer/setCustomer': addLoanApplications,
    addLoanApplication: (state, { loanApplication }) => {
      if (loanApplication.status === 'active') {
        state.activeLoanApplicationIds = [loanApplication.loanApplicationId, ...state.activeLoanApplicationIds]
        if (isEmpty(state.applications)) {
          // This is the first application
          state.currentLoanApplicationId = loanApplication.loanApplicationId
        }
      }
      state.applications[loanApplication.loanApplicationId] = loanApplication
      return state
    },
    setCurrentLoanApplication: (state, loanApplicationId) => {
      state.currentLoanApplicationId = loanApplicationId
      const newState = Object.assign({}, state)
      return newState
    },
    'loans/addAllLoans': (state, { allLoans }) => {
      if (isUndefined(allLoans)) {
        return state
      }
      allLoans.forEach(al => {
        const loanApp = state.applications[al.loanApplicationId]
        if (loanApp) {
          loanApp.loanId = al.externalLoanId
        }
      })
      return state
    }
  },
  effects: (dispatch) => ({
    async createLoanApplication ({ loanApplicationId }, rootState) {
      const { id, customerDetails } = rootState.customer
      const formData = {
        primaryName: customerDetails.fullName,
        // primaryEmail: customerDetails.primaryEmail,
        primaryPhone: customerDetails.primaryPhone,
        isPrimaryPhoneVerified: 'yes',
        loanApplicationId,
        status: 'ACTIVE',
        customerId: customerDetails.$id
      }
      try {
        const loanApplication = await apiService.appApi.loanApplication.create(formData, id)
        dispatch.loanApplications.addLoanApplication({ loanApplication })
      } catch (e) {
        console.log(e)
        throw new Error('CANNOT_CREATE_LOAN_APPLICATION')
      }
    },
    async removeLoanApplication ({ loanApplicationId }, rootState) {
      const loanApplication = rootState.loanApplications[loanApplicationId]
      if (!isUndefined(loanApplication)) {
        await apiService.appApi.loans.deleteLoanApplication(rootState)
        dispatch.loanApplications.deleteLoanApplication({ loanApplicationId })
      }
    }
  })
}
export default loanApplications
