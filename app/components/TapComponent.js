import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Button } from 'semantic-ui-react';

var socket = io(window.location.origin)

export default class TapComponent extends Component {
  constructor() {
    super()
    
    this.state={
      size: "massive",
      color: "purple"
    }

    this.handleTouchStart = this.handleTouchStart.bind(this)
  }

  handleTouchStart(e) {
    e.preventDefault();
    this.state.color === "green" ? 
    this.setState({color: "purple"}) :
    this.setState({color: "green"})
    socket.emit('tappingScreen')
  }

  render() {
    return (
      <div className="mobileComponent">
        <Button basic circular className="tapButton" size="massive" onTouchStart={this.handleTouchStart}
          color={this.state.color}>
          T A P
        </Button>
      </div>
    )
  }
}

