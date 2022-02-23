class BodyHeaderService {
  static getTwelveRandomChars () {
    return Math.random()
      .toString(36)
      .substring(1, 12)
  }

  getRequestBodyHeaders () {
    return {
      actor_type: 'ADMIN',
      authorization: 'c1cc9167-277c-4dd7-bf51-488310860699',
      channel_code: 'LEADRAPP',
      client_code: 'Novopay',
      client_ip: '192.168.43.1',
      device_id: '60de94f494b5c986',
      end_channel_code: 'NOVOPAY',
      function_code: 'DEFAULT',
      function_sub_code: 'DEFAULT',
      locale: '',
      location: '14.2144697,76.4198565',
      operation_mode: 'SELF',
      run_mode: 'REAL',
      sim_number: 'N/A',
      stan: this.getStan(),
      tenant_code: 'npretail',
      transmission_datetime: new Date().getTime().toString(),
      user_handle_type: 'MSISDN',
      user_handle_value: '9019178817',
      user_id: '316587'
    }
	}

  getRequestBodyHeadersV1 () {
    const tenantCode = 'novopay'
		const userId = '1'
		const locale = 'en-US'
		let bodyHeader = {
      tenant_code: tenantCode,
      user_id: userId,
      client_code: 'los',
      channel_code: 'NOVOPAY',
      end_channel_code: 'NOVOPAY',
      stan: this.getStan(),
      client_ip: '127.0.0.1',
      transmission_datetime: new Date().getTime().toString(),
      operation_mode: 'SELF',
      retry_count: '',
      run_mode: 'REAL',
      actor_type: 'CUSTOMER',
      user_handle_type: 'MSISDN',
      user_handle_value: '9816923672',
      location: '44.968046;-94.420307',
      function_code: 'DEFAULT',
      function_sub_code: 'DEFAULT'
    }
		locale && (bodyHeader.locale = locale)
		return bodyHeader
	}

  getStan () {
    return BodyHeaderService.getTwelveRandomChars() + '_' + new Date().getTime()
	}
}

export default BodyHeaderService
