
/*
  overdue amount  = due date + grace period if this crosses
  due amount = is amt today. will be non zero only on emi date
  is_settled - fully paid - interest, principal, penal + fee
  accrued amount accrued daywise - from the begining of
all accruals will be in that statement entry and will not roll over.
Accruals are not net of paid. So actual to be paid = accrued-paid. Applies for
penal accruals.
within bank - same as to novnopay wallet

  Non payment Fees not supported
  No demand generated for non payment fees.
  We can settle when customer pays.
  We need to adjust statement and UI for non payment fees if possible.
  classification to be added in getloanaccountdetails
*/
import ObjectMapper from 'object-mapper'
import test from './test.json'
const interestCalculationMap = {
  REDUCING_BALANCE: 'REDUCING',
  LOAN_AMOUNT: 'LOAN_AMT'
}
const installmentTypeMap = {
  INSTL_TYP_BULT: 'BULLET', // bullet repayment
  INSTL_TYP_EQU: 'EQUATED', // emi
  INSTL_TYP_PRN: 'EQUAL_PRINCIPAL' // principal divided by number of repayment
}
const frequencyMap = {
  MONTHLY: 'm',
  DAILY: 'd',
  WEEKLY: 'w',
  YEARLY: 'y',
  FORTNIGHTLY: 'f',
  QUARTERLY: 'q',
  HALFYEARLY: 'h'

}

const loanTermMap = {
  MONTH: 'm',
  DAY: 'd',
  YEAR: 'y'
}
const loanStatusTypes = {
  APPROVED: 'approved',
  ACTIVE: 'active',
  OD: 'overdrawn',
  WRITOFF: 'writeoff',
  CLOSED: 'closed'
}

const disbursementModeTypes = {
  CASH: 'CASH',
  ACCTWB: 'WALLET',
  OTHBACCT: 'BANKACCT',
  OTHACWB: 'OTHER_WALLET'
}
const txnSubTypes = {
  CASH: 'CASH',
  EXCESS_AMT: 'EXCESS_AMT',
  NORMAL_ACCRUAL: 'NORMAL',
  PENAL_ACCRUAL: 'PENAL',
  INC_DERECOGNISATION: 'INCOME_DERECOGNITION',
  ASSET_BAL_MOV: 'ASSET_BALANCE_MOVEMENT',
  LOANS: 'PROVISIONING',
  FINAL_WRITE_OFF: 'FINAL_WRITE_OFF'
}
const txnTypes = {
  // FROM novopay lending setup.xls - lms accounting rules
  LOAN_REPAYMENT: 'REPAYMENT',
  LOAN_DISBURSEMENT: 'DISBURSEMENT',
  INTEREST: 'INTEREST',
  LOAN_STATUS_CHANGE: 'ASSET_CLASSIFICATION',
  LOAN_STATUS_CHANGE_REV: 'ASSET_CLASSIFICATION_REV',
  ACCR_PROVISIONING: 'ACCRUAL_PROVISIONING',
  LOAN_WRITE_OFF: 'WRITE_OFF',
  LOAN_PRE_PAYMENT: 'PREPAYMENT',
  LOAN_CLOSURE: 'CLOSURE'
}

const assetClassificationMap = {
  STD: 'STANDARD',
  SUBSTD: 'SUBSTD',
  DOUB: 'DOUBTFUL',
  LOSS: 'LOSS',
  ACC_WRITOFF: 'ACCOUNTING_WRITEOFF',
  FIN_WRITOFF: 'FINAL_WRITEOFF'
}
const txnDetailsMap = {
  PRINCIPAL: 'P'
}
const basicDetailsMapper = {
  'amount_details.disbursed_amount': {
    key: 'loanAmount',
    transform: v => parseInt(v)
  },
  'amount_details.interest_due_amount': {
    key: 'outstanding.interestDueAmount',
    transform: (v) => parseFloat(v)
  },
  'amount_details.total_due_amount': {
    key: 'outstanding.totalDueAmount',
    transform: (v) => parseFloat(v)
  },
  'amount_details.principal_outstanding_amount': {
    key: 'outstanding.principalDueAmount',
    transform: (v) => parseFloat(v)
  },
  'amount_details.penal_due_amount': {
    key: 'outstanding.penalDueAmount',
    transform: (v) => parseFloat(v)
  },
  'installment_details.past_due_days': {
    key: 'outstanding.pastDueDays',
    transform: (v) => parseInt(v)
  },
  'installment_details.paid_installment_count': {
    key: 'outstanding.numInstallmentsPaid',
    transform: (v) => parseInt(v)
  },
  'installment_details.next_installment_due_date': {
    key: 'nextInstallmentDate',
    transform: (v) => parseInt(v)
  },
  'installment_details.installment_amount': {
    key: 'nextInstallmentAmount',
    transform: (v) => parseInt(v)
  },
  'account_details.last_payment_date': {
    key: 'lastPaymentDate',
    transform: (v) => parseInt(v)
  },
  'account_details.first_repayment_date': {
    key: 'firstRepaymentDate',
    transform: (v) => parseInt(v)
  },
  'disbursement_details.disbursement_amount': 'disbursementAmount',
  'disbursement_details.expected_disbursement_date': {
    key: 'expectedDisbursementDate',
    transform: (v) => parseInt(v)
  },
  'disbursement_details.actual_disbursement_date': {
    key: 'disbursementDate',
    transform: (v) => parseInt(v)
  },
  'disbursement_details.mode': {
    key: 'disbursementMode',
    transform: (v) => disbursementModeTypes[v]
  },
  'asset_details.asset_classification': {
    key: 'classificationCode',
    transform: (v) => assetClassificationMap[v]
  },
  'interest_details.upfront_interest_applicable': {
    key: 'isUpFrontInterest',
    transform: (v) => v === 'true'
  },
  'interest_details.upfront_interest_amount': {
    key: 'upfrontInterestAmount',
    transform: (v) => v ? parseFloat(v) : 0
  },
  'interest_details.effective_interest_rate': {
    key: 'interestRate',
    transform: (v) => parseFloat(v)
  },
  'repayment_details.interest_calculation_basis': {
    key: 'interestCalculationBasis',
    transform: (v) => interestCalculationMap[v],
    default: 'REDUCING'
  },
  'repayment_details.maturity_date': {
    key: 'maturityDate',
    transform: v => parseInt(v)
  },
  'repayment_details.installment_type': {
    key: 'installmentType',
    transform: v => installmentTypeMap[v]
  },
  'repayment_details.repayment_frequency': {
    key: 'repaymentFrequency',
    transform: v => frequencyMap[v]
  },
  'repayment_details.first_repayment_date': {
    key: 'firstRepaymentDate',
    transform: v => parseInt(v)
  },
  'loan_details.loan_status': {
    key: 'loanStatus',
    transform: (v) => loanStatusTypes[v]
  },
  'loan_details.product_scheme_code': 'schemeCode',
  'loan_details.product_scheme_name': 'schemeName',
  'loan_details.product_code': 'productCode',
  'loan_details.loan_term_unit': {
    key: 'termUnit',
    transform: (v) => loanTermMap[v]
  },
  'loan_details.loan_term': {
    key: 'term',
    transform: (v) => parseInt(v)
  }
}

const statementMapper = {
  'transaction_details.transaction_ref_no': 'txnId',
  'transaction_details.transaction_date': {
    key: 'txnDate',
    transform: v => parseInt(v)
  },
  'transaction_details.transaction_amount': {
    key: 'amount',
    transform: v => parseFloat(v)
  },
  'transaction_details.transaction_type': {
    key: 'txnType',
    transform: (v) => txnTypes[v]
  },
  'transaction_details.transaction_sub_type': {
    key: 'txnType',
    transform: (v) => txnSubTypes[v]
  },
  'transaction_details.balance_after_transaction': {
    key: 'closingBalance',
    transform: v => parseInt(v)
  }
}
const accountDetailMapper = {
  cr_dr_indicator: 'creditDebit',
  transaction_amount: {
    key: 'txnAmount',
    transform: (v) => parseFloat(v)
  },
  narration: 'narration'
}
const scheduleMapper = {
  installment_amount: {
    key: 'installmentAmount',
    transform: v => parseFloat(v)
  },
  // ACTUAL INTEREST  to be paid
  interest_actual_amount: {
    key: 'interestAmount',
    transform: v => parseFloat(v)
  },
  interest_paid_amount: {
    key: 'interestPaidAmount',
    transform: v => parseFloat(v)
  },
  // Dont use currently
  interest_overdue_amount: {
    key: 'interestOverdueAmount',
    transform: v => parseFloat(v)
  },
  // Overdue amount if there is a grace period
  // actual principal to be paid
  principal_actual_amount: {
    key: 'principalAmount',
    transform: v => parseFloat(v)
  },
  principal_outstanding_amount: {
    key: 'principalOutstanding',
    transform: v => parseFloat(v)
  },
  principal_paid_amount: {
    key: 'principalPaidAmount',
    transform: v => parseFloat(v)
  },
  // Overdue amount if there is a grace period
  // Dont use currently
  principal_overdue_amount: {
    key: 'principalOverdueAmount',
    transform: v => parseFloat(v)
  },
  penalties_accrued_amount: {
    key: 'penaltyAccruedAmount',
    transform: v => parseFloat(v)
  },
  penalties_paid_amount: {
    key: 'penaltyPaidAmount',
    transform: v => parseFloat(v)
  },
  installment_date: {
    key: 'installmentDate',
    transform: v => parseInt(v)
  },
  is_settled: {
    key: 'isTxnSettled',
    transform: v => v === 'true'
  }
}

const prepareLoanDetails = (data) => {
  const { basicDetails, statement, repayment, ...rest } = data
  const mappedBasicDetails = ObjectMapper(basicDetails, basicDetailsMapper)
  const mappedStatement = []
  statement.forEach(st => {
    const stmt = ObjectMapper(st, statementMapper)
    const acDetails = []
    st.transaction_details.account_list.forEach(ad => {
      const acd = ObjectMapper(ad.account_details, accountDetailMapper)
      acDetails.push(acd)
    })
    stmt.details = acDetails
    mappedStatement.push(stmt)
  })
  const mappedRepaymentSchedule = []
  repayment.forEach(repay => {
    const schedule = ObjectMapper(repay, scheduleMapper)
    schedule.penaltyOutstanding = schedule.penaltyAccruedAmount - schedule.penaltyPaidAmount
    schedule.penaltyOutstanding = schedule.penaltyOutstanding > 0 ? schedule.penaltyOutstanding : 0
    mappedRepaymentSchedule.push(schedule)
  })
  return {
    basicDetails: mappedBasicDetails,
    statement: mappedStatement,
    repayment: mappedRepaymentSchedule,
    ...rest
  }
}

export default () => prepareLoanDetails(test)
