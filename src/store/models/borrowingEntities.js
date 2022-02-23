import apiService from '../../apiService'
import { config } from '../../config'

const borrowingEntities = {
  name: 'borrowingEntities',
  state: {

  },
  selectors: {
    getBorrowingEntity: select => rootState => rootState.borrowingEntities[config.entityType]
  },
  reducers: {
    setBorrowerEntities: (state, { borrowingEntities }) => {
      borrowingEntities.forEach(be => {
        state[be.entityType] = be
      })
      return state
    }
  },
  effects: (dispatch) => ({
    async getBorrowingEntities (_, rootState) {
      const borrowingEntities = await apiService.appApi.borrowingEntities.get()
      dispatch.borrowingEntities.setBorrowerEntities({ borrowingEntities })
    }
  })
}
export default borrowingEntities
