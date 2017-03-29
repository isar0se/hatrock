import localStore from 'store'

// CONSTANTS
const RECEIVE_LEFT = 'RECEIVE_LEFT'
const RECEIVE_RIGHT = 'RECEIVE_RIGHT'

// REDUCER
const reducer = (state = {Left: [], Right: []}, action) => {
  switch (action.type) {
    case RECEIVE_LEFT:
      return Object.assign({}, state, {Left: action.queueLeft})
    case RECEIVE_RIGHT:
      return Object.assign({}, state, {Right: action.queueRight})
    default:
      return state
  }
}

// ACTION TYPES
export const receiveQueue = (queue, queueLeftOrRight) => ({
  type: queueLeftOrRight === 'queueLeft' ? RECEIVE_LEFT : RECEIVE_RIGHT,
  [queueLeftOrRight]: queue
})

// ACTION CREATORS
export const fetchQueue = queueLeftOrRight => dispatch => {
  dispatch(receiveQueue(localStore.get(queueLeftOrRight) || [], queueLeftOrRight))
  // console.log(`${queueLeftOrRight}:`, getState()[queueLeftOrRight])
}

export const addToQueue = (video, queueLeftOrRight) => dispatch => {
  // get the correct queue
  const queueToUpdate = localStore.get(queueLeftOrRight) || []
  // update queue
  queueToUpdate.push(video)
  // set new queue
  localStore.set(queueLeftOrRight, queueToUpdate)
  // put new queue on state
  dispatch(receiveQueue(queueToUpdate, queueLeftOrRight))
}

export const removeFromQueue = (videoIdx, queueLeftOrRight) => dispatch => {
  // get the correct queue
  const queueToUpdate = localStore.get(queueLeftOrRight) || []
  // update queue
  queueToUpdate.splice(videoIdx, 1)
  // set new queue
  localStore.set(queueLeftOrRight, queueToUpdate)
  // put new queue on state
  dispatch(receiveQueue(queueToUpdate, queueLeftOrRight))
}

export const insertQueueItem = (video, newIdx, queueLeftOrRight) => dispatch => {
  // console.log('?????#F?F?? INSERTING')
  
  // get the queue to update
  const queueToUpdate = localStore.get(queueLeftOrRight)
  
  // insert the item at the new idx
  queueToUpdate.splice(newIdx, 0, video)

  // reset it on localStore
  localStore.set(queueLeftOrRight, queueToUpdate)
  
  // rereceive it on state
  dispatch(receiveQueue(queueToUpdate, queueLeftOrRight))
}

export const rearrangeQueueItems = (oldIndex, newIndex) => dispatch => {
  const leftLength = localStore.get('queueLeft').length
  // 1. what queue are we starting in ?
  let startDirection = oldIndex < leftLength ? 'queueLeft' : 'queueRight'
  
  let videoIdx = startDirection === 'queueLeft' ? oldIndex : oldIndex - leftLength,
    video = localStore.get(startDirection)[videoIdx]
    // console.log('VIDEO: ', video)
  
  // 2. remove from start queue
  dispatch(removeFromQueue(videoIdx, startDirection))
  
  // 3. what queue are we ending in ?
  // 4. insert into end queue
  if (newIndex < leftLength) {
    dispatch(insertQueueItem(video, newIndex, 'queueLeft'))
  } else {
    dispatch(insertQueueItem(video, newIndex - leftLength, 'queueRight'))
  }
}

export const moveToFront = (videoIdx, queueLeftOrRight) => dispatch => {
  // get the correct queue
  const queueToUpdate = localStore.get(queueLeftOrRight),
  
  // save the video we want to move to front
    video = queueToUpdate.splice(videoIdx, 1)[0]
  
  // move it to front
  queueToUpdate.unshift(video)
  
  // reset queue on localStore
  localStore.set(queueLeftOrRight, queueToUpdate)
  
  // put new queue on state
  dispatch(receiveQueue(queueToUpdate, queueLeftOrRight))
}

export const clearQueue = queueLeftOrRight => dispatch => {
  localStore.set(queueLeftOrRight, [])
  dispatch(receiveQueue([], queueLeftOrRight))
}

export default reducer
// move stuff around: combination of remove from queue and add to queue

// play from back in queue: combination of remove and add
