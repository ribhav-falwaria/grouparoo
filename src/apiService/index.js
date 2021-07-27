import otpService from './OtpService'
import applicationFormService from './applicationFormService'
import loanApplicationService from './loanApplicationService'

export default {
  ...otpService,
  ...applicationFormService,
  ...loanApplicationService
}
