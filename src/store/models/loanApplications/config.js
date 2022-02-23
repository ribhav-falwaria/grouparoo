export default {
  status: [
    {
      status: 'ACTIVE',
      description: 'Loan Application is active'
    },
    {
      status: 'INCOMPLETE',
      description: 'Application incomplete and stale'
    },
    {
      status: 'REJECTED_BY_LENDER',
      description: 'Rejected by lender'
    },
    {
      status: 'REJECTED_BY_NP',
      description: 'Rejected by lender'
    },
    {
      status: 'REJECTED_BY_BORROWER',
      description: 'Rejected by borrower'
    },
    {
      status: 'SUCCESS',
      description: 'Successfully borrowed'
    }
  ],
  // if an application is active, its in one of the following stages
  satage: [
    {
      stage: 'INITIAL',
      description: 'filling application form'
    },
    {
      stage: 'CPV',
      description: 'Awaiting CPV'

    },
    {
      stage: 'KYC',
      description: 'Filling kyc details'
    },
    {
      stage: 'DISBURSAL',
      description: 'Awaiting disbursal'

    },
    {
      stage: 'SUCCESS',
      description: 'Successfully disbursed'
    }
  ]
}
