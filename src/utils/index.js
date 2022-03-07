import isUndefined from 'lodash.isundefined'
export const rupeeFormatter = x => {
  if (isUndefined(x)) {
    return
  }
  x = Math.round(x).toString()
  let afterPoint = ''
  if (x.indexOf('.') > 0) afterPoint = x.substring(x.indexOf('.'), x.length)
  x = Math.floor(x)
  x = x.toString()
  let lastThree = x.substring(x.length - 3)
  const otherNumbers = x.substring(0, x.length - 3)
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint
  return `${res}`
}
export const calculateEmi = (loanAmount, tenure, repaymentUnit) => {
  return 1000
}
