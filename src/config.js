import { PERMISSIONS, RESULTS } from 'react-native-permissions'

export const config = {
  appName: 'Novo Loans',
  entityType: 'retail',
  termsUrl: 'https://www.novopay.in/terms',
  ppUrl: 'https://www.novopay.in/pp',
  appWrite: {
    url: 'https://dev-appwrite.novopay.in/v1',
    projectId: '61fc67b0347f85b8f5b1',
    customersCollectionId: '61fc6872e7eab316406d',
    loanApplicationCollectionId: '61fc9d1ab041f556aa0c',
    loanApplicationIdGenerationFunctionId: '6201dd75d89e37c8bcf5', // - Create a loan Application Id
    lmsManagementFunctionId: '6201e05e6c0fb1554da9', // Function for getting all the existing loans
    loanProductCollectionId: '6200fbbf2bd8d3306064', // Use this later
    loanProductMetadataFunctionId: '6201da9175a47a240fc1', // Loan products metadata
    loanTypesCollectionId: '62009a62478bcc3611a5',
    retrieveLoanOffersFunctionId: '61ff837314b01addd96a',
    borrowingEntitiesCollectionId: '620274f11aaf04f08370',
    retrieveLoanApplicationFunctionId: '61ff77ef81669037d64a',
    addressCollectionId: '61fc93bfae7d80de1ae2'
  },
  DEFAULT_PASSWORD: 'welcome',
  otp: {
    sendOtp: 'https://dev-codeapp.novopay.in/sendOtp',
    validateOtp: 'https://dev-codeapp.novopay.in/validateOtp'
  },
  permissions: {
    permissionTypes: [
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_SMS
    ],
    // This is for android only and not IOS. Need to enhance app for IOS later
    acceptedResults: [
      RESULTS.LIMITED,
      RESULTS.GRANTED
    ]
  },
  loanApplicationWebView: 'https://dev-codeapp.novopay.in/?formName=onboarding_test&stepSchemaName=onboarding_test_mob&isHeaderRequired=false',
  // loanApplicationWebView: 'https://92da-111-125-218-187.ngrok.io/?formName=onboarding_test&stepSchemaName=onboarding_test_mob&isHeaderRequired=false'
  LOAN_APPLICATION_TYPE: 'loanapp',
  FINBOX_CLIENT_API_KEY: '',
  LOAN_DISBURSED_STATUS: 'DISBURSED',
  LOAN_CLOSED_STATUS: 'CLOSED',
  REPAYMENT_PENDIND_STATUS: 'PEN',
  REPAYMENT_PAID_STATUS: 'PAID',
  DEFAULT_PRODUCT_TYPE: 'termloan',
  LOAN_DATE_FORMAT: 'YYYY-MM-DD',
  APP_DATE_FORMAT: 'DD-MMM-YYYY',
  REPAYMENT_AMORTIZED: 'amortized',
  REPAYMNET_UPFRONT: 'upfront',
  REPAYMENT_BULLET_END: 'bulletend',
  REPAYMENT_BULLET_BEGINNING: 'bulletbeginning',
  REPAYMENT_DATE_FORMAT: 'YYYYMMDD',
  TERM_LOAN_AMOUNT_STEP: 25000,
  TERM_LOAN_MIN_AMOUNT: 50000,
  TERM_LOAN_MAX_AMOUNT: 300000
}
