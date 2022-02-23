import axios from 'axios'
import { config } from '../config'
const sendOtp = async (mobileNumber) => {
  const response = await axios.post(config.otp.sendOtp, { mob: mobileNumber })
  if (response.data.status.toLowerCase() === 'failed') {
    throw new Error('CANNOT_SEND_OTP')
  }
}

const validateOtp = async (mobileNumber, otpNumber) => {
  const response = await axios.post(config.otp.validateOtp, {
    mob: mobileNumber,
    otp: parseInt(otpNumber)
  })
  if (response.data.status.toLowerCase() === 'failed') {
    return {
      status: false
    }
  } else {
    return {
      status: true
    }
  }
}

export default {
  sendOtp,
  validateOtp
}
