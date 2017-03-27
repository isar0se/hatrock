import localStore from 'store'

// CONSTANTS
const RECEIVE_LEFT = 'RECEIVE_LEFT'
const RECEIVE_RIGHT = 'RECEIVE_RIGHT'

//REDUCER
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
	console.log('?E??E? removing ??')
	// get the correct queue
	const queueToUpdate = localStore.get(queueLeftOrRight) || []
	// update queue
	queueToUpdate.splice(videoIdx, 1)
	// set new queue
	localStore.set(queueLeftOrRight, queueToUpdate)
	// put new queue on state
	dispatch(fetchQueue(queueLeftOrRight))
}

export const setQueue = (queue, queueLeftOrRight) => dispatch => {
	localStore.set(queueLeftOrRight, queue)
	dispatch(receiveQueue(queue, queueLeftOrRight))
}

export const insertQueueItem = (video, newIdx, queueLeftOrRight) => dispatch => {
	console.log('?????#F?F?? INSERTING')
	
	// get the queue to update
	const queueToUpdate = localStore.get(queueLeftOrRight)
	
	// insert the item at the new idx
	queueToUpdate.splice(newIdx, 0, video)

	// reset it on localStore
	localStore.set(queueLeftOrRight, queueToUpdate)
	
	// rereceive it on state
	dispatch(receiveQueue(queueToUpdate, queueLeftOrRight))
}

export const clearQueue = queueLeftOrRight => dispatch => {
	localStore.set(queueLeftOrRight, [])
	dispatch(receiveQueue([], queueLeftOrRight))
}

export const loadYoutubePlaylist = playlistItems => dispatch =>{
	localStore.set("queueLeft", [])
	localStore.set("queueRight", [])

	let queueLeft=[]
	let queueRight=[]

	playlistItems.filter(item => item.snippet.thumbnails /*filters out videos that have been deleted but are still in playlists*/).forEach((item, index)=>{
		// let itemForQueue={
		// 	title: item.snippet.title,
		// 	thumbnail: item.snippet.thumbnails.default.url,
		// 	id:{
		// 		videoId: item.snippet.resourceId.videoId
		// 	}
		// }
		index % 2 === 0 ? queueLeft.push(item) : queueRight.push(item)
	})

	localStore.set("queueLeft", queueLeft)
	localStore.set("queueRight", queueRight)
	dispatch(receiveQueue(queueLeft, 'queueLeft'))
	dispatch(receiveQueue(queueRight, 'queueRight'))
}


export default reducer
// move stuff around: combination of remove from queue and add to queue

// play from back in queue: combination of remove and add
