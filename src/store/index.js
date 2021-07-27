import {
  init
} from '@rematch/core'
import models from './models'
import loading from '@rematch/loading'
import updated from '@rematch/updated'
// import persist from '@rematch/persist'
// import storage from 'redux-persist/lib/storage'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'

const store = init({
  models,
  plugins: [
    updated(),
    loading(),
    // persist({
    //   key: 'persist-storage',
    //   storage,
    //   whitelist: ['settings']
    // }),
    immerPlugin({
      whitelist: ['settings']
    }),
    selectPlugin()
  ]
})

export default store
