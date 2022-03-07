import { config } from '../../config'
const handleSuccess = () => {
  return {
    transactionComplete: true,
    success: true
  }
}

const handleFlagged = () => {
  return {
    transactionComplete: true,
    success: false,
    tryAgain: true
  }
}

const handlePending = () => {
  return {
    transactionComplete: true,
    success: false,
    tryAgain: false
  }
}
const handleFailed = () => {
  return {
    transactionComplete: true,
    success: false,
    tryAgain: true
  }
}

const handleCancelled = () => {
  return {
    transactionComplete: false,
    success: false,
    tryAgain: true
  }
}

const handleIncomplete = () => {
  return {
    transactionComplete: false,
    success: false,
    tryAgain: false
  }
}

const handleUserDropped = () => {
  return {
    transactionComplete: false,
    success: false,
    tryAgain: true
  }
}

const handleVoid = () => {
  return {
    transactionComplete: false,
    success: false,
    tryAgain: true
  }
}
const statusActions = {
  [config.CASHFREE_STATUSES.SUCCESS]: handleSuccess,
  [config.CASHFREE_STATUSES.FLAGGED]: handleFlagged,
  [config.CASHFREE_STATUSES.PENDING]: handlePending,
  [config.CASHFREE_STATUSES.FAILED]: handleFailed,
  [config.CASHFREE_STATUSES.CANCELLED]: handleCancelled,
  [config.CASHFREE_STATUSES.INCOMPLETE]: handleIncomplete,
  [config.CASHFREE_STATUSES.USER_DROPPED]: handleUserDropped,
  [config.CASHFREE_STATUSES.VOID]: handleVoid
}

export default statusActions
