import axios from 'axios'
import localStore from 'store'

// CONSTANTS
export const RECEIVE_SET = 'RECEIVE_SET'

// REDUCER
export const reducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SET:
      return action.set
    default:
      return state
  }
}

// ACTION TYPES
export const receiveSet = set => ({
  type: RECEIVE_SET,
  set
})

// ACTION CREATORS
export const fetchSetItems = () => dispatch => {
  let setItems = localStore.get('set') ? localStore.get('set') : []
  dispatch(receiveSet(setItems))
  console.log('SET', setItems)
}

export const fetchSetFromDb = (/*title? id? userId?*/) => dispatch => {
  // do axios stuff
}

export const fetchAllSetsFromDb = () => dispatch => {
  // do axios stuff
}

export const addToSet = setItem => dispatch => {
  let setToUpdate = localStore.get('set') ? localStore.get('set') : []
  setToUpdate.push(setItem)
  localStore.set('set', setToUpdate)
  dispatch(receiveSet(setToUpdate))
}

export const saveSetToDb = (set) => dispatch => {
  console.log("Getting the set!", set)
  axios.post('/api/sets', set)
    .then(() => {console.log("Saved set and everything's working!")})
    .catch(console.error)
  // axios stuff:
  // when do we want todo this ? do we want users to be able to update their sets in the database ? or does saving a set to the database reset the set in localStorage ?
}

export const clearSet = () => dispatch => {
  // BEFORE WE CLEAR SET, SEND IT TO DATABASE VIA AXIOS
  localStore.set('set', [])
  dispatch(receiveSet([]))
}

export default reducer