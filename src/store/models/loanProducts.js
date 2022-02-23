import apiService from '../../apiService'
import { config } from '../../config'
const loanProducts = {
  name: 'loanProducts',
  state: {
  },
  selectors: {
    getProductById: select => (rootState, { productId }) => {
      return rootState.loanProducts[productId]
    },
    getProductDisplayName: select => (rootState, { productId }) => {
      const product = select.loanProducts.getProductById(rootState, { productId })
      const name = select.loanTypes.getDisplayName(rootState, {
        loanTypeId: product.loanTypeId
      })
      return name
    },
    getRepaymentDescription: select => (rootState, { productId }) => {
      const product = select.loanProducts.getProductById(rootState, { productId })
      if (product.interestRepaymentMode === config.REPAYMENT_AMORTIZED) {
        return {
          description: 'loan.amortization',
          mode: config.REPAYMENT_AMORTIZED
        }
      } else if (product.interestRepaymentMode === config.REPAYMNET_UPFRONT) {
        return {
          principal: 'loan.principalAmount',
          pincipalAndInterest: 'loan.principalAndInterest',
          interest: 'loan.interestAmount',
          mode: config.REPAYMNET_UPFRONT

        }
      } else if (product.interestRepaymentMode === config.REPAYMENT_BULLET_END) {
        return {
          description: 'loan.repaymentAmount',
          principal: 'loan.principalAmount',
          interest: 'loan.interestAmount',
          mode: config.REPAYMENT_BULLET_END

        }
      } else if (product.interestRepaymentMode === config.REPAYMENT_BULLET_BEGINNING) {
        return {
          principal: 'loan.principalAmount',
          interest: 'loan.interestAmount',
          mode: config.REPAYMENT_BULLET_BEGINNING
        }
      }
    },
    getRepaymentFrequencyForDisplay: select => (rootState, { productId }) => {
      const product = select.loanProducts.getProductById(rootState, { productId })
      if (product.interestRepaymentMode === config.REPAYMENT_AMORTIZED) {
        return {
          repaymentFrequency: `period.per.${product.interestFrequency}`,
          repaymentMode: `product.repayment.${product.interestRepaymentMode}`
        }
      } else if (product.interestRepaymentMode === config.REPAYMNET_UPFRONT) {
        return {
          repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
          interestFrequency: `period.per.${product.interestFrequency}`,
          principalFrequency: `period.per.${product.principalFrequency}`,
          repaymentModeInterest: `product.repayment.interest.${product.interestRepaymentMode}`,
          repaymentModePrincipal: `product.repayment.principal.${product.interestRepaymentMode}`
        }
      } else if (product.interestRepaymentMode === config.REPAYMENT_BULLET_END) {
        return {
          repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
          repaymentModeInterest: `product.repayment.interest.${product.interestRepaymentMode}`,
          repaymentModePrincipal: `product.repayment.principal.${product.interestRepaymentMode}`
        }
      } else if (product.interestRepaymentMode === config.REPAYMENT_BULLET_BEGINNING) {
        return {
          repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
          repaymentFrequency: `product.repayment.interest.${product.interestRepaymentMode}`
        }
      } else {
        return {}
      }
    }
  },
  reducers: {
    setLoanProducts: (state, { products }) => {
      products.forEach(pr => {
        state[pr.$id] = pr
      })
      return state
    }
  },
  effects: (dispatch) => ({
    async getAllProducts (_, rootState) {
      try {
        const executionId = await apiService.appApi.loanProducts.getAll.execute()
        const products = await apiService.appApi.loanProducts.getAll.get(executionId)
        dispatch.loanProducts.setLoanProducts({ products })
      } catch (e) {
        throw new Error(e.message)
      }
    }
  })
}

export default loanProducts
