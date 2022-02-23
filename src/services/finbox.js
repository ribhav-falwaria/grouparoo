import FinBoxRiskSdk from 'react-native-risk-sdk'
const syncSmsDataPeriodic = () => {
  FinBoxRiskSdk.createUser(
    'CLIENT_API_KEY',
    'CUSTOMER_ID',
    (errorStatus) => {
      // Error Callback
      console.log('Error status -> ', errorStatus)
    },
    (msg) => {
      // Success Callback, Call the periodic sync once the user has been created
      console.log('Final message', msg)
      // Start the sync periodically after every 12 hour
      FinBoxRiskSdk.startPeriodicSync(12)
    }
  )
}
const resetSync = () => {

}
export {
  syncSmsDataPeriodic,
  resetSync
}
