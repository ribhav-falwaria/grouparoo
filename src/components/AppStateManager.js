import React from 'react'
import { useSelector } from 'react-redux'
import useAppState from 'react-native-appstate-hook'
import apiService from '../apiService'
import dayjs from 'dayjs'
import { config } from '../config'
// render `inactive` screen via top-level `AppStateManager` component
const AppStateManager = (props) => {
  const customerDetails = useSelector(state => state.customer.customerDetails)
  useAppState({
    onForeground: apiService.appApi.stateEvents.send({
      customerId: customerDetails?.$id || 'NA',
      appStatus: 'active',
      createdOn: dayjs().valueOf(),
      eventTypeId: config.EVENT_ACTIVE
    }),
    onBackground: apiService.appApi.stateEvents.send({
      customerId: customerDetails?.$id || 'NA',
      appStatus: 'background',
      createdOn: dayjs().valueOf(),
      eventTypeId: config.EVENT_ACTIVE
    })
  })
  return (
    <>
      {props.children}
    </>
  )
}


export default AppStateManager
