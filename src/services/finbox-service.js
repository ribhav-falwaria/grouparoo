import FinBoxRiskSdk from 'react-native-risk-sdk'
import { config } from '../config'
// Function to trigger RiskSdk
const getDeviceConnectData = (custonerId) => {
  FinBoxRiskSdk.createUser(
    config.FINBOX_CLIENT_API_KEY,
    custonerId,
    (errorStatus) => {
      // Error Callback
      console.log('Error status -> ', errorStatus)
    },
    (msg) => {
      // Success Callback, Call the periodic sync once the user has been created
      console.log('Final message', msg)
      FinBoxRiskSdk.startPeriodicSync(24)
    }
  )
}

export default getDeviceConnectData
