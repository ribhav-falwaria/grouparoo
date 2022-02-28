import dayjs from 'dayjs'
import orderBy from 'lodash.orderby'
import isUndefined from 'lodash.isundefined'
import maxBy from 'lodash.maxby'
import humanizeDuration from 'humanize-duration'
import { rupeeFormatter } from '../../utils'
import apiService from '../../apiService'
import { config } from '../../config'
import loanDetails from './loans old/mapper'
const formatAmount = amount => rupeeFormatter(parseFloat(amount))
/*************** loanApplicationId and loanId are used interchangably here *************/
const loans = {
  name: 'loans',
  state: {},
  selectors: {
    // loanId and loanApplicationId used fungably
    getLoanById: select => (rootState, { loanApplicationId }) => {
      return rootState.loans[loanApplicationId]
    },
    hasActiveLoan: select => (rootState) => {
      return Object.keys(rootState.loans)
        .map(rs => rs.status === config.LOAN_DISBURSED_STATUS)
        .some(
          (v) => v === true
        )
    },
    getById: (select) => (rootState, loanApplicationId) => {
      return rootState.loans[loanApplicationId]
    },
    list: (select) => rootState => {
      const loans = rootState.loans
      return Object.keys(loans).map(ky => loans[ky])
    },
    getDpdSchedule: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      const notRepaid = loan.repayment
        .filter(
          schedule => !schedule.isTxnSettled
        )
        .filter(
          schedule => dayjs().diff(dayjs(parseInt(schedule.installment_date)), 'day', true) > 1
        )
      return notRepaid
    },
    getTotalDpdAmount: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      /*
      {
      "interestDueAmount": null,
      "totalDueAmount": -126.92,
      "principalDueAmount": 0,
      "penalDueAmount": 126.92,
      "pastDueDays": 96,
      "numInstallmentsPaid": 4
    },
      */
      return loan.basicDetails.outstanding
    },
    getActiveLoans: select => rootState => {
      return select.loans
        .list(rootState)
        .filter(loan => loan.status === config.LOAN_DISBURSED_STATUS)
    },
    getProductName: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      if (!isUndefined(loan)) {
        const product = select.loanProducts.getProductBySchemeCode({
          schemeCode: loan.basicDetails.schemeCode,
          schemeName: loan.basicDetails.schemeName
        })
        return product.displayName
      }
    },
    getLoanAccountNumber: select => (rootState, { loanId }) => {
      // Since loan Account Number will be the same as the loanApplicationId
      return loanId
      // return rootState.loans[loanId].externalLoanId
    },
    getLoanAmount: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return loan.basicDetails.loanAmount
    },
    getMaturityDate: select => (rootState, { loanId }) => {
      const loan = select.loans.getById(rootState, loanId)
      return dayjs(parseInt(loan.basicDetails.maturityDate)).format(
        'DD-MMM-YY'
      )
    },
    //FIXME: NEEDS A SOLUTION
    getRemainingPrincipal: select => (rootState, { loanId, formatted }) => {
      const loan = select.loans.getById(rootState, loanId)
      // depends on repayment frequency as well. 
      // if (loan.basicDetails.repaymentFrequency === )
      // loan.repayment.find(rp => {
      //   rp.installmentDate
      // })
    },
    getRemainingTenure: select => (rootState, { loanId }) => {
      const language = select.settings.getLanguage(rootState)
      const maturityDate = select.loans.getMaturityDate(rootState, { loanId })
      const loan = select.loans.getById(rootState, loanId)
      const product = select.loanProducts.getProductBySchemeCode(rootState, {
        schemeCode: loan.basicDetails.schemeCode,
        schemeName: loan.basicDetails.schemeName
      })
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
      const product = select.loanProducts.getProductBySchemeCode(rootState, {
        schemeCode: loan.basicDetails.schemeCode,
        schemeName: loan.basicDetails.schemeName
      })
      const interestRate = loan.basicDetails.interestRate
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
        state[al.loanApplicationId] = al
      })
      return state
    }
  },
  effects: (dispatch) => ({
    async getAllLoans (_, rootState) {
      const { customer } = rootState
      try {
        const executionId = await apiService.appApi.loans.getAllLoans.execute(customer.customerDetails.$id)
        const allLoans = await apiService.appApi.loans.getAllLoans.get(executionId)
        const loan = loanDetails()
        dispatch.loans.addAllLoans({ allLoans: [loan] })
      } catch (e) {
        console.log(e.stack)
        console.log(e.message)
      }
    }
  })
}
export default loans
