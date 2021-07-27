const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let todos = [
  {
    id: 'AF4343', // FIXME: The response does not have id. Need to insert it
    interest_details: {
      upfront_interest_period_unit_value: 'Monthly',
      upfront_interest_applicable: 'false',
      upfront_interest_period: null,
      interest_setup_id: '138',
      interest_round_off_type: 'RND_OFF_TYP_RDN',
      interest_rounding_factor: '0',
      upfront_interest_amount: '0.00',
      interest_setup_code: 'IS_RoundDown',
      effective_interest_rate: '13.000000',
      interest_setup_name: 'RoundDown Interest setup',
      interest_calculation_days_in_month: 'DIM_ACTUAL',
      interest_calculation_days_in_month_value: 'Actual',
      account_spread: '1.000000',
      interest_calculation_days_in_year: 'DIY_ACTUAL',
      scheme_interest_rate: '12.000000',
      interest_round_off_type_value: 'Round Down',
      upfront_interest_period_unit: 'MONTHLY',
      interest_calculation_days_in_year_value: 'Actual'
    },
    disbursement_details: {
      mode: 'CASH',
      mode_value: 'Cash',
      expected_disbursement_date: '1626460200000',
      disbursement_amount: '50000.00'
    },
    repayment_details: {
      installment_multiples_of_value: '0',
      interest_calculation_basis_value: 'Reducing Balance',
      number_of_installments: '12',
      interest_frequency_value: 'Monthly',
      interest_calculation_basis: 'REDUCING_BALANCE',
      maturity_date: '1656009000000',
      installment_type: 'INSTL_TYP_EQU',
      first_interest_payment_date: '1627065000000',
      mode: 'CASH',
      mode_value: 'Cash',
      installment_rounding_type_value: null,
      installment_rounding_type: null,
      interest_frequency: 'MONTHLY',
      repayment_frequency: 'MONTHLY',
      repayment_frequency_value: 'Monthly',
      installment_rounding_factor: '0',
      first_repayment_date: '1627065000000',
      installment_multiples_of: 'ZERO',
      installment_type_value: 'Equated',
      principal_rounding_factor: '0'
    },
    disbursement_repayment_account_details: [],
    loan_details: {
      product_scheme_id: '294',
      account_number: '0000000540',
      product_scheme_name: 'Loan Product Diff IAD',
      loan_category: 'LOAN_PERS',
      office_code: 'IDFCP1',
      loan_status_value: 'Active',
      loan_category_value: 'Personal Loan',
      loan_product_id: '308',
      product_code: 'shortterm',
      loan_purpose: 'PERSONAL',
      currency_code: 'INR',
      loan_product_version: '0001',
      office_id: '1',
      product_id: '330',
      loan_term_unit_value: 'Months',
      id: '540',
      installment_amount: '5000.000', // FIXME: This is not here
      customer_code: '0000000495',
      loan_status: 'ACTIVE',
      currency_code_value: 'INR',
      loan_amount: '50000.00',
      product_name: 'LoanProdClass diffe',
      loan_term_unit: 'MONTH',
      submitted_on_date: '1626373800000',
      office_name: 'IDFC Head Office',
      customer_photo: null,
      loan_term: '12',
      loan_purpose_value: 'Personal',
      customer_name: 'Srikant Sulpule',
      product_scheme_code: 'LoanClassDiff',
      customer_id: '123'
    },
    loan_repayment_schedule_list: [
      {
        interest_accrued_amount: '53.420000',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '500.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '53.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4412.000000',
        principal_outstanding_amount: '45588.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1626546600000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '500.00',
        principal_currentdue_amount: '0.00'
      },
      {
        interest_accrued_amount: '503.340000',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '503.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '3962.000000',
        principal_outstanding_amount: '41626.000000',
        penalties_accrued_amount: '7.580000',
        installment_date: '1629225000000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '1250.42'
      },
      {
        interest_accrued_amount: '459.590000',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '459.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4006.000000',
        principal_outstanding_amount: '37620.000000',
        penalties_accrued_amount: '15.160000',
        installment_date: '1631903400000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '401.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4064.000000',
        principal_outstanding_amount: '33556.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1634495400000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '370.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4095.000000',
        principal_outstanding_amount: '29461.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1637173800000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '314.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4151.000000',
        principal_outstanding_amount: '25310.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1639765800000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '279.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4186.000000',
        principal_outstanding_amount: '21124.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1642444200000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '233.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4232.000000',
        principal_outstanding_amount: '16892.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1645122600000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '168.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4297.000000',
        principal_outstanding_amount: '12595.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1647541800000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '139.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4326.000000',
        principal_outstanding_amount: '8269.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1650220200000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '4465.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '88.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '4377.000000',
        principal_outstanding_amount: '3892.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1652812200000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      },
      {
        interest_accrued_amount: '0',
        interest_overdue_amount: '0.000000',
        principal_overdue_amount: '0.000000',
        principal_waived_amount: '0.000000',
        installment_amount: '3934.000000',
        penalties_overdue_amount: '0.000000',
        interest_currentdue_amount: '0.000000',
        interest_actual_amount: '42.000000',
        interest_paid_amount: '0.000000',
        penalties_paid_amount: '0.000000',
        penalties_currentdue_amount: '0.000000',
        principal_actual_amount: '3892.000000',
        principal_outstanding_amount: '0.000000',
        penalties_accrued_amount: '0.000000',
        installment_date: '1655490600000',
        interest_waived_amount: '0.000000',
        penalties_waived_amount: '0.000000',
        principal_paid_amount: '0.000000',
        principal_currentdue_amount: '0.000000'
      }
    ]
  }
]

const get = async () => {
  await sleep(100)

  return todos
}

const getById = async id => {
  await sleep(100)

  return todos.find(item => item.id === id)
}

const create = async data => {
  await sleep(100)

  todos.push(data)

  return todos
}

const update = async (id, data) => {
  const todo = todos.find(item => item.id === id)
  const newTodo = Object.assign(todo, data)

  return newTodo
}

const remove = async id => {
  todos = todos.filter(todo => todo.id !== id)

  return todos
}

export const api = {
  get,
  getById,
  create,
  update,
  remove
}
