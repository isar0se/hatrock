import React from 'react'
import {Menu, Button} from 'semantic-ui-react'
import YouTubeSearch from 'APP/app/containers/YouTubeSearch'
import store from 'APP/app/store'
import LoginLogout from 'APP/app/containers/LoginLogout'
import {addToQueue, fetchQueue, clearQueue} from 'APP/app/utils/queue'

var socket = io(window.location.origin)

export const Navbar = () => {
  
  
  
  return (
    <Menu widths={3}>
      <Menu.Item>
        <Button basic onClick={evt => {
          socket.emit('clearVideos')
          evt.preventDefault()
          store.dispatch(clearQueue('queueLeft'))
          store.dispatch(clearQueue('queueRight'))
        }}>clear queues</Button>
        <Button basic onClick={evt => {
          evt.preventDefault()
        }}>save set</Button>
      </Menu.Item>
      <Menu.Item>
        <YouTubeSearch 
          apiKey='AIzaSyBOr-nJwESPXBlOSh-4-bf2R-ayOTUFVt4' // how to use .env on the front-end
          maxResults='5'
          placeHolder='<- search'
          callback={results => {
            store.dispatch(addToQueue(results[0], 'queueLeft'))
          }}
        />
        <YouTubeSearch
          apiKey='AIzaSyBOr-nJwESPXBlOSh-4-bf2R-ayOTUFVt4' // how to use .env on the front-end
          maxResults='5'
          placeHolder='search ->'
          callback={results => {
            store.dispatch(addToQueue(results[0], 'queueRight'))
          }}
        />
      </Menu.Item>
      <LoginLogout />
    </Menu>
  )
}
