import dayjs from 'dayjs'
import orderBy from 'lodash.orderby'
import isUndefined from 'lodash.isundefined'
import maxBy from 'lodash.maxby'
import humanizeDuration from 'humanize-duration'
import { rupeeFormatter } from '../../../utils'
import apiService from '../../../apiService'
import { config } from '../../../config'
const formatAmount = amount => rupeeFormatter(parseFloat(amount))
const loans = {
  name: 'loans',
  state: {},
  selectors: {
    getLoanById: select => (rootState, { loanId }) => {
      return rootState.loans[loanId]
    },
    hasActiveLoan: select => (rootState) => {
      return Object.keys(rootState.loans)
        .map(rs => rs.status === config.LOAN_DISBURSED_STATUS)
        .some(
          (v) => v === true
        )
    },
    getById: (select) => (rootState, { loanId }) => {
      return rootState.loans[loanId]
    },
    list: (select) => rootState => {
      const loans = rootState.loans
      return Object.keys(loans).map(ky => loans[ky])
    },
    getDpdSchedule: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      const notRepaid = loan.details.repaymentDetails.schedule
        .filter(
          schedule => parseInt(schedule.status === config.REPAYMENT_PENDIND_STATUS)
        )
        .filter(
          schedule => dayjs().diff(dayjs(schedule.date), 'day', true) > 1
        )
      return notRepaid
    },
    getTotalDpdAmount: select => (rootState, { loanId }) => {
      const dpdSchedule = select.loans.getDpdSchedule(rootState, { loanId })
      return dpdSchedule.reduce((o, v) => {
        o.emi = o.emi + v.emi
        o.principal = o.principal + v.principal
        o.interest = o.interest + v.interest
        return o
      }, {
        emi: 0,
        principal: 0,
        interest: 0
      })
    },
    getActiveLoans: select => rootState => {
      return select.loans
        .list(rootState)
        .filter(loan => loan.status === config.LOAN_DISBURSED_STATUS)
    },
    getProductName: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      const product = select.loanProduct.getById(loan.details.productId)
      return product.displayName
    },
    getLoanAccountNumber: select => (rootState, { loanId }) => {
      return rootState.loans[loanId].externalLoanId
    },
    getLoanAmount: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return parseFloat(loan.details.finalApprovedAmount)
    },
    getMaturityDate: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      const lastEmi = maxBy(loan.details.repaymentDetails.schedule, 'date')
      return dayjs(lastEmi.date).format(
        'DD-MMM-YY'
      )
    },
    getRemainingPrincipal: select => (rootState, { loanId, formatted }) => {
      const loan = select.loans.getById(rootState, loanId)
      return formatted ? rupeeFormatter(loan.details.principalOutstanding) : loan.details.principalOutstanding
    },
    getRemainingTenure: select => (rootState, { loanId }) => {
      const language = select.settings.getLanguage(rootState)
      const maturityDate = select.loans.getMaturityDate(rootState, { loanId })
      const loan = select.loans.getById(rootState, { loanId })
      const product = select.loanProducts.getProductById(rootState, { productId: loan.details.productId })
      const diff = maturityDate.diff(dayjs())
      const inDays = dayjs.duration(diff).asDays()
      const productType = product.productType || config.DEFAULT_PRODUCT_TYPE
      if (productType === 'shortterm') {
        if (inDays < 7) {
          return humanizeDuration(diff, {
            units: ['d'],
            round: true,
            language
          })
        } else {
          return humanizeDuration(diff, {
            units: ['w'],
            round: true,
            language
          })
        }
      } else if (loan.loan_details.product_code === 'termloan') {
        if (inDays > 365) {
          return humanizeDuration(diff, {
            units: ['y'],
            round: true,
            language
          })
        } else if (inDays > 30) {
          return humanizeDuration(diff, {
            units: ['m'],
            round: true,
            language
          })
        } else if (inDays > 7) {
          return humanizeDuration(diff, {
            units: ['w'],
            round: true,
            language
          })
        } else {
          return humanizeDuration(diff, {
            units: ['d'],
            round: true,
            language
          })
        }
      } else if (
        ['creditline, purchasecredit'].indexOf(
          loan.loan_details.product_code
        ) !== -1
      ) {
        return humanizeDuration(diff, { units: ['d'], round: true, language })
      }
      return humanizeDuration(diff, { units: ['w'], round: true, language })
    },
    getIsPrepayEnabled: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return loan.canPrepay || false
    },
    getInterestDetails: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      const product = select.loanProducts.getProductById(rootState, {
        productId: loan.details.productId
      })
      const interestRate = 24
      const interestFrequency = `period.per.${product.interestFrequency}`
      return {
        interestRate: `${interestRate}% ${interestFrequency}`,
        interestAmount: product.interestRepaymentMode === 'upfront'
          ? `${formatAmount(
            232323
          )} ${interestFrequency}}`
          : null
      }
    },
    getAmortizationDetails: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return {
        amount: parseFloat(loan.loan_details.installment_amount),
        units: `period.per.${loan.repayment_details.repayment_frequency.toLowerCase()}`
      }
    },
    getDisbursementDate: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return dayjs(
        parseInt(loan.disbursement_details.expected_disbursement_date)
      ).format('DD-MMM-YYYY')
    },
    getPrepayEnabled: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return loan.loan_details.prepay_enabled
    },

    getLoanDetailsForDisplay: select => (rootState, { loanId }) => {
      const { externalLoanId, details } = select.loans.getById(rootState, loanId)
      const loanDetailsForDisplay = {
        loanApplicationNumber: externalLoanId,
        finalApprovedAmount: rupeeFormatter(details.finalApprovedAmount),
        disbursalDate: dayjs(details.disbursalDate, config.LOAN_DATE_FORMAT).format(config.APP_DATE_FORMAT),
        totalOutstanding: rupeeFormatter(details.totalOutstanding),
        principalOutstanding: rupeeFormatter(details.principalOutstanding),
        nextRepaymentDate: dayjs(details.nextRepaymentDate, config.LOAN_DATE_FORMAT).format(config.APP_DATE_FORMAT),
        appliedLoanAmount: rupeeFormatter(details.appliedLoanAmount),
        previousRepaymentDate: dayjs(details.previousRepaymentDate, config.LOAN_DATE_FORMAT).format(config.APP_DATE_FORMAT),
        emi: rupeeFormatter(details.emi),
        repayment: select.product.getRepaymentFrequencyForDisplay(rootState, { productId: details.productId }),
        displayName: select.product.getProductDisplayName(rootState, {
          productId: details.productId
        }),
        tenure: details.tenure
      }
      return loanDetailsForDisplay
    },
    getRepaymentSchedule: select => (rootState, { loanId }) => {
      const { details: { repaymentSchedule, productId } } = select.loans.getById(rootState, loanId)
      const { mode, ...descriptions } = select.loanProducts.getRepaymentDescription(rootState, { productId })
      return orderBy(repaymentSchedule, (rd) => parseInt(rd.date), ['desc']).map(
        rd => {
          let { emi, interest, principal, date, status } = rd
          if (isUndefined(emi) || emi === 0) {
            return {}
          }
          principal = isUndefined(principal) ? 0 : principal
          interest = isUndefined(interest) ? 0 : interest
          let description
          const isFullyPaid = status === config.REPAYMENT_PAID_STATUS
          let amount
          if (mode === config.REPAYMNET_UPFRONT) {
            if (principal > 0 && interest > 0) {
              description = descriptions.principalAndInterest
              amount = emi
            } else if (principal > 0) {
              description = descriptions.principal
              amount = principal
            } else if (interest > 0) {
              description = descriptions.interest
              amount = interest
            }
          } else if (mode === config.REPAYMENT_AMORTIZED) {
            description = descriptions.description
            amount = emi
          } else if (mode === config.REPAYMENT_BULLET_BEGINNING) {
            description = descriptions.principal
            amount = principal
          } else if (mode === config.REPAYMENT_BULLET_END) {
            description = descriptions.description
            amount = emi
          }
          return {
            amount,
            isFullyPaid,
            description,
            interest,
            principal,
            repaymentDate: dayjs(date, config.REPAYMENT_DATE_FORMAT).format('DD-MMM-YYYY')
          }
        }
      )
    },
    getUpcomingRepayment: select => (rootState, { loanId }) => {
      const repaymentSchedule = select.loans.getRepaymentSchedule(rootState, { loanId })
      const upcomingRepayment = orderBy(
        repaymentSchedule.filter(
          rp => rp.repaymentDate > dayjs() && rp.status === config.REPAYMENT_PENDIND_STATUS
        ),
        ['repaymentDate'],
        ['desc']
      )
      return upcomingRepayment[0]
    },
    getPendingRepayment: select => (rootState, { loanId }) => {
      const repaymentSchedule = select.loans.getRepaymentSchedule(rootState, { loanId })
      const repaymentTillNow = orderBy(
        repaymentSchedule.filter(
          rp => rp.repaymentDate < dayjs() && rp.status === config.REPAYMENT_PENDIND_STATUS
        ),
        ['repaymentDate'],
        ['desc']
      )
      if (repaymentTillNow.length > 0) {
        // There can be both interest and principal or principal
        const repaymentAmount = repaymentTillNow.reduce(
          (o, v) => {
            v.principal = v.principal + o.principal
            v.interest = v.interest + o.interest
            v.total = v.total + o.amount
            return v
          },
          {
            principal: 0,
            interest: 0,
            total: 0
          })
        return {
          repaymentAmount,
          repaymentDetails: repaymentTillNow
        }
      } else {
        return {}
      }
    }
  },
  reducers: {
    addAllLoans: (state, { allLoans }) => {
      if (isUndefined(allLoans)) {
        return state
      }
      allLoans.forEach(al => {
        state[al.externalLoanId] = al
      })
      return state
    }
  },
  effects: (dispatch) => ({
    async getAllLoans (_, rootState) {
      const { customer } = rootState
      // FIXME: Move execute / get in 2 steps
      try {
        const executionId = await apiService.appApi.loans.getAllLoans.execute(customer.customerDetails.$id)
        const allLoans = await apiService.appApi.loans.getAllLoans.get(executionId)
        dispatch.loans.addAllLoans({ allLoans })
      } catch (e) {
        console.log(e.stack)
        console.log(e.message)
      }
    }
  })
}
export default loans
