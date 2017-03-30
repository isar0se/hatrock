import React, { Component } from 'react'
import {connect} from 'react-redux'
import {sketch, sketch2} from '../sketches/sketchMobile'
import P5Wrapper from 'react-p5-wrapper'
import EmoticonButtons from '../components/EmoticonButtons'
import TapComponent from '../components/TapComponent'
import SliderComponent from '../components/SliderComponent'

var socket = io(window.location.origin)

//ISSUE ::::
// on first load, if interface isn't touchpad:

class LiveApp extends Component {

  constructor(){
    super()
    this.state={
      interface: ""
    }

    this.handleEmojiClick=this.handleEmojiClick.bind(this)
  }

  componentDidMount() {
    socket.on('allowInteraction', (interaction) => {
      console.log("changing to", interaction);
      if(this.state.interface !== interaction){
        this.setState({interface: interaction})
      }
    })

    if(this.state.interface=== ""){
      socket.emit('getInterface')
    }

    this.handleTouchMove=this.handleTouchMove.bind(this)
  }

  handleTouchMove(e){
    console.log("Mouse is moving")
    e.preventDefault()
    let x, y
    x=e.touches[0].clientX
    y=e.touches[0].clientY
    socket.emit('mouse_position', {x, y})
  }

  handleEmojiClick(emoji){
    console.log("emoji clicked was", emoji)
    socket.emit('emojiClicked', emoji)
  }

  render() {
    return (
      <div>
        {/*Refactor this*/}
          {this.state.interface === "touchpad" ?
          <div className="touchPad"  onTouchMove={this.handleTouchMove}>
            <div id="p5parent">
              <h1 className="draw">Draw</h1>
              <P5Wrapper sketch={sketch}/>
            </div>
          </div> : null}
          {/*this.state.interface === "touchpadColor" ?
          <div className="touchPad"  onTouchMove={this.handleTouchMove}>
            <div id="p5parent">
              <h4>Shimmy with your touch screen COLOR</h4>
              <P5Wrapper sketch={sketch2}/>
            </div>
          </div> : null*/}
          {this.state.interface === "emoticons" ? <EmoticonButtons handleEmojiClick={this.handleEmojiClick}/>: null}
          {this.state.interface === "tap" ? <TapComponent /> : null}
          {this.state.interface === "slider" ? <SliderComponent /> : null}
      </div>
    )
  }
}

const mapStateToProps=state => {
  return {
    command: state.command
  }
}

export default connect(mapStateToProps)(LiveApp);
