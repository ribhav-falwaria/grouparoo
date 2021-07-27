import dayjs from 'dayjs'
import orderBy from 'lodash.orderby'
import humanizeDuration from 'humanize-duration'
import createListModels from '../../createListModels'
import { api } from './api'
import { rupeeFormatter } from '../../../utils'
const formatAmount = amount => rupeeFormatter(parseFloat(amount))
const loanApplications = {
  name: 'loans',
  api,
  extensions: {
    initialState: [],
    selectors: {
      getDpdSchedule: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        const notRepaid = loan.loan_repayment_schedule_list
          .filter(
            repSchedule => parseInt(repSchedule.installment_date) < Date.now()
          )
          .filter(
            repSchedule =>
              parseFloat(repSchedule.principal_overdue_amount) > 0 ||
              parseFloat(repSchedule.interest_overdue_amount) > 0
          )
        return notRepaid.map(nr => ({
          dueDate: dayjs(nr.installment_date).format('DD-MMM-YYYY'),
          amount:
            parseFloat(nr.principal_overdue_amount) +
            parseFloat(nr.interest_overdue_amount)
        }))
      },
      getTotalDpdAmount: select => (rootState, { loanId }) => {
        const dpdSchedule = select.loans.getDpdSchedule(rootState, { loanId })
        return dpdSchedule.reduce((o, v) => {
          o = o + v.amount
          return o
        }, 0)
      },
      getActiveLoans: select => rootState => {
        return select.loans
          .list(rootState)
          .filter(la => la.loan_details.loan_status === 'ACTIVE')
      },
      getProductName: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        return loan.loan_details.product_name
      },
      getLoanAccountNumber: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        const acNo = loan.loan_details.account_number
        return {
          truncated: `XXXX${acNo.substr(acNo.length - 5)}`,
          full: acNo
        }
      },
      getLoanAmount: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        return parseFloat(loan.loan_details.loan_amount)
      },
      getMaturityDate: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        return dayjs(parseInt(loan.repayment_details.maturity_date)).format(
          'DD-MMM-YY'
        )
      },
      getRemainingPrincipal: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)

        const principalPaid = loan.loan_repayment_schedule_list.reduce(
          (v, o) => {
            v = v + parseFloat(o.principal_paid_amount)
            return v
          },
          0
        )
        return rupeeFormatter(loan.loan_details.loan_amount - principalPaid)
      },
      getRemainingTenure: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        const language = select.settings.getLanguage(rootState)
        const maturityDate = dayjs(
          parseInt(loan.repayment_details.maturity_date)
        )
        const diff = maturityDate.diff(dayjs())
        const inDays = dayjs.duration(diff).asDays()
        if (loan.loan_details.product_code === 'shortterm') {
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
        return loan.prepay_enabled
      },
      getInterestDetails: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        const interestDetails = loan.interest_details
        const repaymentDetails = loan.repayment_details
        const isUpfront = interestDetails.upfront_interest_applicable === 'true'
        const interestFrequency = isUpfront
          ? `period.per.${repaymentDetails.interest_frequency.toLowerCase()}`
          : 'period.per.year'
        return {
          interestRate: `${interestDetails.scheme_interest_rate}% ${interestFrequency}`,
          interestAmount: isUpfront
            ? `${formatAmount(
                interestDetails.upfront_interest_amount
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
      // FIXME: Need to fix this logic after understanding logic
      getRepaymentSchedule: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        const repaymentTillDate = loan.loan_repayment_schedule_list.filter(
          rp => parseInt(rp.installment_date) < Date.now()
        )
        const isUpfront =
          loan.interest_details.upfront_interest_applicable === 'true'
        return orderBy(repaymentTillDate, ['installment_date'], ['desc']).map(
          rd => {
            const amount = formatAmount(rd.installment_amount)
            const isFullyPaid = (rd.principal_overdue_amount > 0) && (rd.principal_overdue_amount > 0)
            let description
            if (isUpfront) {
              description = 'loan.amortization'
            } else {
              if (parseFloat(rd.principal_actual_amount) > 0 && parseFloat(rd.interest_actual_amount) > 0) {
                description = 'loan.principalAndInterest'
              }
              if (parseFloat(rd.principal_actual_amount > 0)) {
                description = 'loan.amortization'
              }
              if (parseFloat(rd.interest_actual_amount) > 0) {
                description = 'loan.interest'
              }
            }
            return {
              amount,
              isFullyPaid,
              description,
              repaymentDate: dayjs(parseInt(rd.installment_date)).format('DD-MMM-YYYY')
            }
          }
        )
      },
      getUpcomingRepayment: select => (rootState, { loanId }) => {
        const loan = select.loans.getById(rootState, loanId)
        const repaymentFromNow = orderBy(
          loan.loan_repayment_schedule_list.filter(
            rp => parseInt(rp.installment_date) < Date.now()
          ),
          ['installment_date'],
          ['desc']
        )
        if (repaymentFromNow.length > 0) {
          // There can be both interest and principal or principal
          const nextRepaymentDate = repaymentFromNow[0].installment_date
          const allNextRepayments = repaymentFromNow.filter(
            rp => rp.installment_date === nextRepaymentDate
          )
          const repaymentAmount = allNextRepayments.reduce((o, v) => o + parseFloat(v.installment_amount), 0)
          return {
            repaymentAmount: repaymentAmount,
            repaymentDate: dayjs(parseInt(nextRepaymentDate)).format(
              'DD-MMM-YYYY'
            )
          }
        } else {
          return null
        }
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
