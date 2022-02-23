export default [{
  heading: 'Short Period Loans',
  loanOfferId: 'offr01',
  estimatedInterestRate: 15,
  maxLoanAmount: 200000,
  tenures: [3, 6, 9, 12],
  repayments: ['d', 'w', 'm'],
  unit: 'm',
  unitDisplay: 'Months'
}
]


export const loanOfferPart2 = [{
  heading: 'Short Period Loans',
  estimatedInterestRate: 15,
  productId: 100,
  maxLoanAmount: 200000,
  offers: [
    {
      offerId: 'offer11',
      tenure: 3,
      unit: 'm',
      unitDisplay: 'Months',
      repayments: ['d', 'w', 'm'],
      defaultRepayment: 'm'
    },
    {
      offerId: 'offer12',
      tenure: 6,
      unit: 'm',
      repayments: ['d', 'w', 'm'],
      defaultRepayment: 'm',
      reccomended: true
    },
    {
      offerId: 'offer13',
      tenure: 9,
      unit: 'm',
      repayments: ['d', 'w', 'm'],
      defaultRepayment: 'm'
    }
  ]
},
{
  heading: 'Medium Term Loans',
  estimatedInterestRate: 15,
  maxLoanAmount: 200000,
  productId: 101,
  offers: [
    {
      offerId: 'offer11',
      tenure: 12,
      unit: 'm',
      repayments: ['m'],
      defaultRepayment: 'm'
    },
    {
      offerId: 'offer12',
      tenure: 1.5,
      unit: 'y',
      repayments: ['m'],
      defaultRepayment: 'm',
      reccomended: true
    },
    {
      offerId: 'offer13',
      tenure: 2,
      unit: 'y',
      repayments: ['m'],
      defaultRepayment: 'm'
    }
  ]
}]
