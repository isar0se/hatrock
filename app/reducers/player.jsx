import {combineReducers} from 'redux'

// CONSTANTS
const SET_VIDEO = 'SET_VIDEO',
  PLAY_VIDEO = 'PLAY_VIDEO',
  PAUSE_VIDEO = 'PAUSE_VIDEO',
  SET_PLAYBACK_RATE = 'SET_PLAYBACK_RATE',
  SEEK_TO = 'SEEK_TO',
  SET_OPACITY = 'SET_OPACITY',
  initialPlayerState = {
    currentVideo: '',
    isPlaying: false,
    playbackRate: 1
  },
  opacityFilter = {
    opacity: 0.5
  }

// ACTION TYPES
const player = (state = initialPlayerState, action) {
  
  const newState = Object.assign({}, state)
  
  switch (action.type) {
    case SET_VIDEO:
      newState.currentVideo = action.videoId
      break;
    case PLAY_VIDEO:
      newState.isPlaying = true
      break;
    case PAUSE_VIDEO:
      newState.isPlaying = false
      break;
    case SET_PLAYBACK_RATE:
      newState.playBackRate = action.
      
  }
}

// ACTION CREATORS
export const setVideo = videoId => {
  type: SET_VIDEO,
  currentVideo: videoId 
}

export const play = leftOrRight => {
  // need to use socket to actually 
}

export const pause = leftOrRight => {
  
}

export const seekTo = leftOrRight => {
  
}

// REDUCER
const playerReducer = combineReducers({
 left: player,
 right: player
})

export default playerReducer

this.state.player = {
  left: { // in back—opacity stays at 1
    currentVideo: 'videoId',
    isPlaying: false,
    playbackRate: 1,
    
    
  },
  right: { // in front—opacity is dynamic, starts at .5
    currentVideo: 'videoId',
    isPlaying: false,
    playbackRate: 1,
    opacity: 0.5,
    
  }
}