import axios from 'axios'
import localStore from 'store'
import {receiveQueue} from './queue'

// CONSTANTS
const RECEIVE_PLAYLISTS = 'RECEIVE_PLAYLISTS'
  
// INITIAL STATE
const initialState = {
  userPlaylists: []
}

// REDUCER
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_PLAYLISTS:
      return Object.assign({}, state, {userPlaylists: action.userPlaylists})
    default:
      return state
  }
}

// ACTION TYPES
// export const receiveAccessToken = accessToken => ({
//  type: RECEIVE_TOKEN,
//  accessToken
// })

export const receiveUserPlaylists = userPlaylists => ({
  type: RECEIVE_PLAYLISTS,
  userPlaylists
})

// export const receiveSelectedPlaylist = selectedPlaylist => ({
//  type: RECEIVE_PLAYLIST,
//  selectedPlaylist
// })

// UTIL
const fetchAccessToken = userId => axios.get(`/api/auth/users/${userId}`)

const fetchPlaylist = (accessToken, playlistId) => axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?access_token=${accessToken}&part=snippet&maxResults=50&playlistId=${playlistId}`)

// ACTION CREATORS
export const fetchUserPlaylists = userId => dispatch => {
  fetchAccessToken(userId)
    .then(res => {
      let accessToken = res.data.accessToken
      axios.get(`https://www.googleapis.com/youtube/v3/playlists?access_token=${accessToken}&part=snippet&mine=true`)
        .then(res => {
          dispatch(receiveUserPlaylists(res.data.items))
        })
    })
    .catch(console.error)
}

export const fetchSelectedPlaylist = (userId, playlistId) => dispatch => {
  fetchAccessToken(userId)
    .then(res => {
      let accessToken = res.data.accessToken
      fetchPlaylist(accessToken, playlistId)
      .then(res => {
        dispatch(loadYoutubePlaylist(res.data.items))
      })
    })
    .catch(console.error)
}

const loadYoutubePlaylist = playlistItems => dispatch => {
  
  let queueLeft = [], queueRight = []

  localStore.set("queueLeft", [])
  localStore.set("queueRight", [])

  playlistItems.filter(item => item.snippet.thumbnails /*filters out videos that have been deleted but are still in playlists*/).forEach((item, index)=> {
    let itemForQueue = {
      id: {videoId: item.snippet.resourceId.videoId},
      snippet: {
        title: item.snippet.title,
        thumbnails: {default: {url: item.snippet.thumbnails.default.url}}
      }
    }
    index % 2 === 0 ? queueLeft.push(itemForQueue) : queueRight.push(itemForQueue)
  })

  localStore.set("queueLeft", queueLeft)
  localStore.set("queueRight", queueRight)
  dispatch(receiveQueue(queueLeft, 'queueLeft'))
  dispatch(receiveQueue(queueRight, 'queueRight'))
}

export default reducer