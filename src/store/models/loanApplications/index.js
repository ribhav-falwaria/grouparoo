import dayjs from 'dayjs'
import createListModels from '../../createListModels'
import { api } from './api'
const loanApplications = {
  name: 'loanApplications',
  api,
  extensions: {
    state: [],
    selectors: {
      getActiveLoanApplications: select => rootState => {
        return select.loanApplications
          .list(rootState)
          .filter(la => la.applicationStatus === 'active')
      },
      getLoanAmount: select => (rootState, { loanApplicationId }) => {
        const loanApplication = select.loanApplications.getById(
          rootState,
          loanApplicationId
        )
        return loanApplication.currentLoanOffer.loanAmount
      },
      getStartDate: select => (rootState, { loanApplicationId }) => {
        const loanApplication = select.loanApplications.getById(
          rootState,
          loanApplicationId
        )
        return dayjs(loanApplication.createdAt).format('DD-MMM-YYYY')
      }
    },
    reducers: {},
    effects: (dispatch, baseEffects) => ({
      async create (payload, rootState) {
        const { data } = payload
        return baseEffects.createAsync(data)
      },
      async update (payload, rootState) {
        const { id, data } = payload
        baseEffects.updateAsync(id, data)
      },
      async remove (payload, rootState) {
        const { id } = payload
        baseEffects.removeAsync(id)
      },
      async get (payload, rootState) {
        const { id } = payload
        baseEffects.getAsync(id)
      },
      async getById (payload, rootState) {
        const { id, params } = payload
        return baseEffects.getByIdAsync(id, params)
      }
    })
  }
}
export default createListModels(
  loanApplications.name,
  loanApplications.api,
  loanApplications.extensions
)
