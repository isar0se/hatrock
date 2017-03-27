import store from 'store'
import {RECEIVE_RIGHT, receiveQueue, fetchQueue, addToQueue, removeFromQueue} from '../utils/queue'

// REDUCER
const reducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_RIGHT:
      return action.queueRight
  }
  return state
}

export default reducer
