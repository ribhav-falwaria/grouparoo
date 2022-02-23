import { request, checkMultiple, RESULTS } from 'react-native-permissions'
import { config } from '../config'
const checkPermissions = async () => {
  const statuses = await checkMultiple(config.permissions.permissionTypes)
  return statuses
}

const requestPermission = async (permission, rationale) => {
  const result = await request(permission, rationale)
  return result
}
const processPermissions = async (rationale, translations) => {
  const permissionStatuses = await checkPermissions()
  const { permissionTypes, acceptedResults } = config.permissions
  const permissionResults = {}
  for (let r = 0; r < permissionTypes.length; r++) {
    const permission = permissionTypes[r]
    const thisRationale = rationale[permission]
    const status = permissionStatuses[permission]
    if (acceptedResults.indexOf(status) === -1) {
      if (status === RESULTS.DENIED) {
        const result = await requestPermission(permission, {
          message: translations[thisRationale.message],
          title: translations[thisRationale.title],
          positive: translations[thisRationale.positive],
          negative: translations[thisRationale.negative]
        })
        permissionResults[permission] = result
      }
    } else {
      permissionResults[permission] = status
    }
  }
  return permissionResults
}
export {
  checkPermissions,
  requestPermission,
  processPermissions
}
