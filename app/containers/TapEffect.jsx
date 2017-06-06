// node modules
import React, {Component} from 'react'

// local files
import {lastTwoSecondsOfTaps} from 'APP/app/utils'

var socket = io(window.location.origin)

export default class TapEffect extends Component {
  constructor() {
    super()

    this.state = {
      taps: []
    }
  }

  componentDidMount() {
    // store taps as an array of Date.now()'s
    // .25 speed:   < 1 tap / second
    // .5 speed:    1 tap / second
    // .75 speed:   1.5 taps / second
    // 1 speed:     2 taps / second
    // 1.25 speed:  3 taps / second
    // 1.5 speed:   4 taps / second
    // 2 speed:     > 4 taps / second
    
    
    socket.on('updateTapValue', () => {
      this.setState({
        taps: lastTwoSecondsOfTaps(this.state.taps.concat(Date.now()))
      })
      
      let tapesInTwoSeconds = this.state.taps.length
      
      if (1 < tapesInTwoSeconds < 2) {
        socket.emit('changePlaybackRate', 0.25)
      } else if (tapesInTwoSeconds < 3) {
        socket.emit('changePlaybackRate', 0.5)
      } else if (tapesInTwoSeconds < 4) {
        socket.emit('changePlaybackRate', 0.75)
      } else if (tapesInTwoSeconds < 5) {
        socket.emit('changePlaybackRate', 1.0)
      } else if (tapesInTwoSeconds < 6) {
        socket.emit('changePlaybackRate', 1.25)
      } else if (tapesInTwoSeconds < 8) {
        socket.emit('changePlaybackRate', 1.5)
      } else if (tapesInTwoSeconds >= 8) {
        socket.emit('changePlaybackRate', 2.0)
      }
      
      console.log("updating tap value!", this.state.taps)
    })
  }
  
  componentWillUnmount() {
    socket.emit('changePlaybackRate', 1)
  } 

  render() {
    return (
      <div>
      </div>
    )
  }


}
