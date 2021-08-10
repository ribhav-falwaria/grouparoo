const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
import apiServices from '../../../apiService'
import isEmpty from 'lodash.isempty'
let todos = [
  {
    id: 'termloanform',
    formDocId: null,
    jsonSchema: {
      formId: 'Lending',
      formDocId: '25',
      formName: 'customerOnboarding2',
      type: 'object',
      required: [
        'fullName',
        'email',
        'primaryPhone',
        'loanAmount',
        'pan',
        'birthDate',
        'primaryName',
        'businessVintage',
        'annualSales',
        'industry',
        'hasGSTN',
        'hasUdyamAadhar',
        'businessAddress',
        'residentialAddress',
        'bankStatement',
        'incomeTaxReturn',
        'purchaseInvoices',
        'maritalStatus',
        'numberOfDependents',
        'sex',
        'userEducation',
        'userEthnicity',
        'storeCategory',
        'storeOwnership',
        'storeSize',
        'ownOtherStores',
        'numberOfEarningMembers',
        'monthlyIncome',
        'coborrowerName',
        'coborrowerPhone',
        'coborrowerRelation'
      ],
      properties: {
        isPrimaryPhoneVerified: {
          enum: ['yes', 'no'],
          type: 'string',
          title: ''
        },
        numberOfDependents: {
          title: 'Indicate number of dependents',
          type: 'number'
        },
        hasGSTN: {
          enum: ['yes', 'no'],
          title: 'Do you have GSTN registration?',
          type: 'string',
          enumNames: ['Yes', 'No']
        },
        businessVintage: {
          enum: [
            'zero-to-one',
            'one-to-two',
            'two-to-three',
            'three-to-five',
            'more-than-five'
          ],
          title: 'Business Vintage (in years)',
          type: 'string',
          enumNames: [
            '0 - 1 year',
            '1 - 2 years',
            '2 - 3 years',
            '3 - 5 years',
            'more than 5 years'
          ]
        },
        whatsappPermission: {
          title: 'Allow us to connect on whatsapp',
          type: 'boolean'
        },
        industry: {
          enum: [
            'WhiteGoods',
            'Optician',
            'MobilePhone',
            'ApparelandClothing',
            'GymandFitness',
            'Sports',
            'Tailor',
            'Groceries'
          ],
          title: 'Type of Business',
          type: 'string',
          enumNames: [
            'White Goods',
            'Optician',
            'Mobile Phone',
            'Apparel and Clothing',
            'Gym and Fitness',
            'Sports',
            'Tailor',
            'Groceries'
          ]
        },
        bankStatement: {
          title: 'Upload Bank Statement for last 3 months',
          type: 'string'
        },
        coborrowerPhone: {
          title: 'Mobile Number of the co-borrower',
          type: 'number'
        },
        coborrowerRelation: {
          enum: [
            'son',
            'daughter',
            'wife',
            'husband',
            'father',
            'mother',
            'brother',
            'sister',
            'partner',
            'other'
          ],
          title: 'Co-borrower is your',
          type: 'string',
          enumNames: [
            'Son',
            'Daughter',
            'Wife',
            'Husband',
            'Father',
            'Mother',
            'Brother',
            'Sister',
            'Partner',
            'None of these'
          ]
        },
        numberOfEarningMembers: {
          enum: ['one', 'two', 'three', 'threeplus'],
          title: 'Earning members',
          type: 'string',
          enumNames: ['Only me', '2', '3', 'More than 3']
        },
        ownOtherStores: {
          enum: ['No', 'upto-three', 'upto-five', 'abovefive'],
          title: 'Do you own more stores? If yes, please indicate the number',
          type: 'string',
          enumNames: ['No', '1-3', '3-5', '5+']
        },
        storeSize: {
          enum: [
            'upto-hundred',
            'upto-twohundred',
            'upto-fivehundred',
            'upto-thousand',
            'upto-twothousand',
            'twothousandplus'
          ],
          title: 'Store Size',
          type: 'string',
          enumNames: [
            '<100 sq ft',
            '100-200 sq feet',
            '200-500 sq feet',
            '500-1000 sq feet',
            '1000-2000 sq feet',
            '2000+ sq feet'
          ]
        },
        pan: {
          title: 'PAN',
          type: 'string'
        },
        businessAddress: {
          title: 'Please provide full address of your shop',
          type: 'string'
        },
        email: {
          title: 'Email ID',
          type: 'string',
          format: 'email'
        },
        monthlyIncome: {
          title: 'Monthly Income',
          type: 'number'
        },
        annualSales: {
          title: 'How much is your sales in last 12 months?',
          type: 'number'
        },
        purchaseInvoices: {
          title:
            'Please upload last 3 months invoices (whichever are available)',
          type: 'string'
        },
        coborrowerName: {
          title: 'Please provide co-borrower name',
          type: 'string'
        },
        userEducation: {
          enum: ['tenth', 'twelfth', 'grad', 'pg', 'belowtenth'],
          title: 'Please indicate your highest education',
          type: 'string',
          enumNames: [
            'Primary School',
            '10th Pass',
            '12th Pass',
            'Graduation',
            'Post Graduation'
          ]
        },
        sex: {
          enum: ['Male', 'Female', 'Trans', 'others'],
          title: 'Gender',
          type: 'string',
          enumNames: ['Male', 'Female', 'Trans', "Don't want to disclose"]
        },
        fullName: {
          title: 'Full Name',
          type: 'string'
        },
        primaryName: {
          title: 'Name of Business',
          type: 'string'
        },
        storeCategory: {
          enum: [
            'Industrial',
            'Residential',
            'Market',
            'Malls',
            'ShoppingComplex',
            'CentreStore',
            'Temple',
            'Entertainment',
            'Highways',
            'Others'
          ],
          title: 'Store Category',
          type: 'string',
          enumNames: [
            'Industrial',
            'Residential',
            'Market',
            'Malls',
            'Shopping complex',
            'Centre Store',
            'Temple/Shrine',
            'Entertainment',
            'Highways',
            'None of these'
          ]
        },
        storeOwnership: {
          enum: ['owned', 'rented'],
          title: 'Owned / Rented',
          type: 'string',
          enumNames: ['Owned', 'Rented']
        },
        birthDate: {
          title: 'Date of Birth',
          type: 'string'
        },
        loanAmount: {
          title: 'Loan Amount',
          type: 'number'
        },
        incomeTaxReturn: {
          title: 'Upload ITR for last 2 years',
          type: 'string'
        },
        coborrowerAddressCheck: {
          title:
            'Click here if co-borrower address is same as borrower address',
          type: 'boolean'
        },
        primaryPhone: {
          title: 'Mobile Number',
          type: 'string'
        },
        hasSne: {
          enum: ['yes', 'no'],
          title: 'Do you have Shop and Establishment certificate?',
          type: 'string',
          enumNames: ['Yes', 'No']
        },
        coborrowerAddress: {
          title: 'Please share the address of the co-borrower',
          type: 'string'
        },
        residentialAddress: {
          title: 'Please provide residential address',
          type: 'string'
        },
        maritalStatus: {
          enum: ['married', 'unmarried', 'divorced', 'widow-widower'],
          title: 'Marital Status',
          type: 'string',
          enumNames: ['Married', 'Unmarried', 'Divorced', 'Widow/Widower']
        },
        hasUdyamAadhar: {
          enum: ['yes', 'no'],
          title: 'Do you have Udyam Aadhar number?',
          type: 'string',
          enumNames: ['Yes', 'No']
        },
        userEthnicity: {
          enum: ['Hindu', 'Christian', 'Sikh', 'Muslim', 'other'],
          title: 'Religion',
          type: 'string',
          enumNames: ['Hindu', 'Christian', 'Sikh', 'Muslim', 'Others']
        }
      },
      dependencies: {}
    },
    uiSchema: {
      formId: 'form_3',
      formDocId: '15',
      formName: 'customerOnboarding2',
      values: {
        isPrimaryPhoneVerified: {
          'ui:widget': 'OtpWidget'
        },
        hasGSTN: {
          'ui:widget': 'radio'
        },
        hasSne: {
          'ui:widget': 'radio'
        },
        residentialAddress: {
          'ui:widget': 'textarea'
        },
        primaryPhone: {
          'ui:widget': 'MobileWidget'
        },
        loanAmount: {
          'ui:widget': 'AmountWidget'
        },
        'ui:order': [
          'fullName',
          'primaryPhone',
          'whatsappPermission',
          'email',
          'isPrimaryPhoneVerified',
          'loanAmount',
          'pan',
          'birthDate',
          'primaryName',
          'businessVintage',
          'annualSales',
          'industry',
          'hasGSTN',
          'hasUdyamAadhar',
          'hasSne',
          'businessAddress',
          'residentialAddress',
          'bankStatement',
          'incomeTaxReturn',
          'purchaseInvoices',
          'maritalStatus',
          'numberOfDependents',
          'sex',
          'userEducation',
          'userEthnicity',
          'storeCategory',
          'storeOwnership',
          'storeSize',
          'ownOtherStores',
          'numberOfEarningMembers',
          'monthlyIncome',
          'coborrowerName',
          'coborrowerPhone',
          'coborrowerAddressCheck',
          'coborrowerAddress',
          'coborrowerRelation'
        ],
        storeOwnership: {
          'ui:widget': 'radio'
        },
        businessAddress: {
          'ui:widget': 'textarea'
        },
        email: {
          'ui:autocomplete': 'email'
        },
        hasUdyamAadhar: {
          'ui:widget': 'radio'
        }
      }
    },
    schemaSteps: {
      formId: 'ewe',
      formName: 'ewe',
      steps: {
        '1': {
          stepTitle: 'Registration',
          stepName: 'basicData',
          stepDescription: 'Basic Registration Details',
          stepFields: [
            'fullName',
            'primaryPhone',
            'email',
            'loanAmount',
            'whatsappPermission'
          ]
        },
        '2': {
          stepName: 'OTP',
          stepTitle: 'OTP',
          stepDescription: 'Verify Mobile Number',
          stepFields: [
            'isPrimaryPhoneVerified'
          ]
        },
        '3': {
          stepTitle: 'Company Details',
          stepName: 'panData',
          stepDescription: 'Company and Pan Details',
          stepFields: [
            'pan',
            'birthDate',
            'primaryName',
            'businessVintage',
            'annualSales',
            'industry'
          ]
        },
        '4': {
          stepTitle: 'Business Documents',
          stepName: 'businessIdentity',
          stepDescription: 'Business identity document',
          stepFields: ['hasGSTN', 'hasUdyamAadhar', 'hasSne']
        },
        '5': {
          stepTitle: 'Communication Address',
          stepName: 'addressStep',
          stepDescription: 'Residential and business address',
          stepFields: ['businessAddress', 'residentialAddress']
        },
        '6': {
          stepTitle: 'Income Proof',
          stepName: 'incomeDocucment',
          stepDescription: 'Documents for income proof',
          stepFields: ['bankStatement', 'purchaseInvoices', 'incomeTaxReturn']
        },
        '7': {
          stepTitle: 'Demographic Information',
          stepName: 'demographic',
          stepDescription: 'Demography and education details',
          stepFields: [
            'numberOfDependents',
            'sex',
            'userEducation',
            'maritalStatus',
            'userEthnicity'
          ]
        },
        '8': {
          stepTitle: 'Income Data',
          stepName: 'incomeData',
          stepDescription: 'Sources of income',
          stepFields: [
            'monthlyIncome',
            'numberOfEarningMembers',
            'storeCategory',
            'storeOwnership',
            'storeSize',
            'ownOtherStores',
            'monthlyRent'
          ]
        },
        '9': {
          stepTitle: 'Co-Borrower',
          stepDescription: 'Details about co-borrower',
          stepName: 'coBorrower',
          stepFields: [
            'coborrowerName',
            'coborrowerPhone',
            'coborrowerAddress',
            'coborrowerAddressCheck'
          ]
        }
      }
    }
  }
]

const get = async () => {
  await sleep(100)

  return todos
}

const getById = async (id, params) => {
  const response = await apiServices.getApplicationFormById(id, params)
  if (isEmpty(response)) {
    return todos.find(t => t.id === id)
  }
  return response
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
