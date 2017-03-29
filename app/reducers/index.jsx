import {combineReducers} from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  command: require('./command').default,
  player: require ('./player').default,
  playlists: require('./playlists').default,
  queue: require('./queue').default,
  set: require('./set').default,
  sets: require('./sets').default
})

export default rootReducer
