import React from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import LoanApplicationList from './LoanApplicationList'

const ManageLoanApplications = ({ navigation, route }) => {
  const store = useStore()
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const activeLoanApplications = store.select.loanApplications.getActiveLoanApplications(state)
  const onEditLoanApplication = async (loanApplicationId) => {
    await dispatch.loanApplications.setCurrentLoanApplication(loanApplicationId)
    navigation.navigate('ApplicationForm')
  }

  return (
    <LoanApplicationList
      activeLoanApplications={activeLoanApplications}
      onEditLoanApplication={onEditLoanApplication}
    />
  )
}

export default ManageLoanApplications
