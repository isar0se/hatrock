'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'
import {fetchQueue} from 'APP/app/utils/queue'
import {fetchSetItems} from 'APP/app/reducers/set'
import store from 'APP/app/store'
import {Output} from 'APP/app/components/Output'
import {Root} from 'APP/app/components/Root'
import LiveApp from './containers/LiveApp'
import EffectScreen from './containers/EffectScreen'
import Controller from './containers/Controller'

import SaveSet from 'APP/app/components/SaveSet'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log("*******I have connected to the server!*****")
})

// fetch videos for output screen as soon as possible
// socket.on('outputReadyForPlayerVideos', () => {
//  let queueLeft = localStore.get('queueLeft'),
//    queueRight = localStore.get('queueRight')
  
//  socket.emit('playerMountedLeft', queueLeft[0].id.videoId)
//  socket.emit('playerMountedRight', queueRight[0].id.videoId)
// })

const onRootEnter = () => {
  store.dispatch(fetchQueue('queueLeft'))
  store.dispatch(fetchQueue('queueRight'))
  store.dispatch(fetchSetItems())
}

render (
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={Root} onEnter={onRootEnter} />
			<Route path="/effects" component={EffectScreen} />
			<Route path="/output" component={Output} />
			<Route path="/live" component={LiveApp} />
			<Route path="/controller" component={Controller}/>
			<Route path="/set" component={SaveSet}/>
		</Router>
	</Provider>,
	document.getElementById('main')
)
