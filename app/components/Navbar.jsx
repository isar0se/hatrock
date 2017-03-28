import React from 'react'
import {Menu, Button, Container, Input} from 'semantic-ui-react'
import YouTubeSearch from 'APP/app/containers/YouTubeSearch'
import store from 'APP/app/store'
import LoginLogout from 'APP/app/containers/LoginLogout'
import {addToQueue, fetchQueue, clearQueue} from 'APP/app/reducers/queue'

var socket = io(window.location.origin)

export const Navbar = () => {

  var buttonSpacingStyle = {
    marginRight: "10px"
  }

  return (
    <Menu widths={3} inverted style={{width: "100%", margin: "0 auto"}}>
      <Container fluid>
      <Menu.Item style={{ width: "25%", marginLeft: "300px"}}>
        <Button basic color={"youtube"} inverted onClick={evt => {
          socket.emit('clearVideos')
          evt.preventDefault()
          store.dispatch(clearQueue('queueLeft'))
          store.dispatch(clearQueue('queueRight'))
        }} style={buttonSpacingStyle}>Clear Queues</Button>
      </Menu.Item>
      <Menu.Item style={{width: "50%"}}>
        {/*<YouTubeSearch
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
            // console.log(results[0])
            store.dispatch(addToQueue(results[0], 'queueRight'))
          }}
        />*/}
        <Input fluid placeholder="Search Youtube" icon="search" style={{margin: "5px 20px"}}/>
      </Menu.Item>
      <LoginLogout />
      </Container>
    </Menu>
  )
}
