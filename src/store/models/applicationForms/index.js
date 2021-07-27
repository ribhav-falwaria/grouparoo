import createListModels from '../../createListModels'
import { api } from './api'
const applicationForms = {
  name: 'applicationForms',
  api,
  extensions: {
    state: [],
    reducers: {},
    effects: (dispatch, baseEffects) => ({
      async create (payload, rootState) {
        const { data } = payload
        return baseEffects.createAsync(data)
      },
      async update (payload, rootState) {
        const { id, data } = payload
        baseEffects.updateAsync(id, data)
      },
      async remove (payload, rootState) {
        const { id } = payload
        baseEffects.removeAsync(id)
      },
      async get (payload, rootState) {
        const { id } = payload
        baseEffects.getAsync(id)
      },
      async getById (payload, rootState) {
        const { id, params } = payload
        return baseEffects.getByIdAsync(id, params)
      }
    })
  }
}
export default createListModels(
  applicationForms.name,
  applicationForms.api,
  applicationForms.extensions
)
