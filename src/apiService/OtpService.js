const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const sendOtp = async (phonenumber) => {
  await sleep(200)
  return { status: 'success' }
}

export default {
  sendOtp
}
