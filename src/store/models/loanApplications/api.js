import apiServices from '../../../apiService/'
import isEmpty from 'lodash.isempty'
import { nanoid } from 'nanoid/non-secure'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let todos = [
  {
    id: '60e44fc2713c2fccf3a16837',
    userId: 'HRmTorAeB9BoBLEW9',
    modifiedBy: 'HRmTorAeB9BoBLEW9',
    createdAt: '2021-07-06T12:42:42.949Z',
    primaryBorrowerId: 'z4e3KhEgGHrNrSxaN',
    coBorrowerId: 'zLfCoELuorCtpwCtS',
    companyId: 'y6kpeKFc3LkeMrFX7',
    softCreditId: 'bBixnbLcz',
    productType: 'shortterm',
    bureauCreditScoreRefId: 'o2fCaL6M3',
    applicationDocuments: [
      {
        documentType: 'pan',
        documentName: 'pan',
        documentRefId: 'DCo836',
        documentVerified: true,
        documentVerificationDetails: {
          verified: true,
          verificationSource: 'Karxxa'
        }
      },
      {
        documentType: 'udyam',
        documentName: 'udyam',
        documentRefId: 'QikhxF',
        documentVerified: true,
        documentVerificationDetails: {
          verified: true,
          verificationSource: 'Karxxa'
        }
      },
      {
        documentType: 'sne',
        documentName: 'sne',
        documentRefId: 'Wwgrca',
        documentVerified: true,
        documentVerificationDetails: {
          verified: true,
          verificationSource: 'Karxxa'
        }
      },
      {
        documentType: 'mobile-bill',
        documentName: 'mobile-bill',
        documentRefId: 'DQzKkw',
        documentVerified: true,
        documentVerificationDetails: {
          verified: true,
          verificationSource: 'Karxxa'
        }
      },
      {
        documentType: 'bank-statement',
        documentName: 'bank-statement',
        documentRefId: 'PvGTP8',
        documentVerified: true,
        documentVerificationDetails: {
          verified: true,
          verificationSource: 'Karxxa'
        }
      }
    ],
    borrowerType: 'retailer',
    loanOffers: [
      {
        loanProduct: '100 Day Loan',
        productCode: '9885',
        loanAmount: 500000,
        interestRate: 2.5,
        interestFrequency: 'per-month',
        loanOfferStage: 'revised',
        loanOfferDate: '2021-07-06T12:42:42.874Z',
        lender: 'NP'
      },
      {
        loanProduct: '100 Day Loan',
        productCode: '9885',
        loanAmount: 100000,
        interestRate: 2.5,
        interestFrequency: 'per-month',
        loanOfferStage: 'revised',
        loanOfferDate: '2021-07-06T12:42:42.874Z',
        lender: 'NP'
      },
      {
        loanProduct: '100 Day Loan',
        productCode: '9885',
        loanAmount: 125000,
        interestRate: 2.5,
        interestFrequency: 'per-month',
        loanOfferStage: 'revised',
        loanOfferDate: '2021-07-06T12:42:42.874Z',
        lender: 'NP'
      },
      {
        loanProduct: '100 Day Loan',
        productCode: '9885',
        loanAmount: 150000,
        interestRate: 2.5,
        interestFrequency: 'per-month',
        loanOfferStage: 'revised',
        loanOfferDate: '2021-07-06T12:42:42.874Z',
        lender: 'NP'
      },
      {
        loanProduct: '100 Day Loan',
        productCode: '9885',
        loanAmount: 200000,
        interestRate: 2.5,
        interestFrequency: 'per-month',
        loanOfferStage: 'revised',
        loanOfferDate: '2021-07-06T12:42:42.874Z',
        lender: 'NP'
      }
    ],
    currentLoanOffer: {
      loanProduct: '100 Day Loan',
      productCode: '9885',
      loanAmount: 200000,
      interestRate: 2.5,
      interestFrequency: 'per-month',
      loanOfferStage: 'final',
      loanOfferDate: '2021-07-06T12:42:42.874Z',
      lender: 'NP'
    },
    stages: [
      {
        currentStage: 'PD',
        stageChangeDate: '2021-07-06T12:42:42.874Z',
        stateSuccess: 'success'
      },
      {
        currentStage: 'PD',
        stageChangeDate: '2021-07-06T12:42:42.874Z',
        stateSuccess: 'success'
      }
    ],
    currentStage: {
      currentStage: 'PD',
      stageChangeDate: '2021-07-06T12:42:42.874Z',
      stateSuccess: 'success'
    },
    statusChangeDate: '2021-07-06T12:42:42.874Z',
    applicationStatus: 'active',
    creditScore: {
      creditScore: 700,
      scoreSource: 'CIBIL',
      createdAt: '2021-07-06T12:42:42.874Z',
      scoreType: 'soft'
    },
    integrationId: 'HZcCyzySGzCfTpDtK',
    applicationNumber: 'RET1014',
    updatedAt: '2021-07-06T12:42:42.949Z'
  }
]

const get = async (params) => {
  await sleep(100)

  return todos
}

const getById = async (id, params) => {
  const response = await apiServices.getLoanApplication(id, params)
  return response
}

const create = async ({ formData, customer, loanType }) => {
  const response = await apiServices.updateLoanApplication(customer.customerId, {
    formData,
    formName: loanType.formName
  })
  if (isEmpty(response)) {
    return {
      formData,
      id: formData.id || nanoid(),
      data: {
        formData,
        formName: loanType.formName,
        loanTypeId: loanType.id,
        errors: {}
      }
    }
  }
  response.data.loanTypeId = loanType.id
  return response
}

const update = async (id, { formData, customer, loanType }) => {
  formData.id = id
  const response = await apiServices.updateLoanApplication(customer.customerId, {
    formData, formName: loanType.formName
  })
  if (isEmpty(response)) {
    return {
      id,
      data: {
        formData,
        formName: loanType.formName,
        loanTypeId: loanType.id
      }
    }
  }
  response.data.loanTypeId = loanType.id
  return response
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
