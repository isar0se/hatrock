import localStore from 'store'

// CONSTANTS
const RECEIVE_LEFT = 'RECEIVE_LEFT'
const RECEIVE_RIGHT = 'RECEIVE_RIGHT'

// REDUCER
const reducer = (state = {Left: {}, Right: {}}, action) => {
  switch (action.type) {
    case RECEIVE_LEFT:
      return Object.assign({}, state, {Left: action.playerLeft})
    case RECEIVE_RIGHT:
      return Object.assign({}, state, {Right: action.playerRight})
    default:
      return state
  }
}

// ACTION TYPES
export const receivePlayer = playerLeftOrRight => ({
  type: playerLeftOrRight === 'playerLeft' ? RECEIVE_LEFT : RECEIVE_RIGHT,
  [playerLeftOrRight]: localStore.get(playerLeftOrRight)
})

// ACTION CREATORS
export const savePlayer = (player, playerLeftOrRight) => dispatch => {
  localStore.set(playerLeftOrRight, player)
  dispatch(receivePlayer(playerLeftOrRight))
}

export default reducer
