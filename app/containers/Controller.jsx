import React, { Component } from 'react'
import {connect} from 'react-redux'
import {setCommand} from '../reducers/command'
import {Link} from 'react-router'
import SliderComponent from 'APP/app/components/SliderComponent'
import SortableQueue from 'APP/app/components/SortableQueue'


// from state: liveEffect

var socket = io(window.location.origin)

class Controller extends Component {

  constructor(){
    super()
    this.commandType=this.commandType.bind(this)
    this.handleWhiteButton = this.handleWhiteButton.bind(this)
    this.handleColorButton = this.handleColorButton.bind(this)
    this.handleEmoticonsButton = this.handleEmoticonsButton.bind(this)
    this.handleTapButton = this.handleTapButton.bind(this)
    this.handleSliderButton = this.handleSliderButton.bind(this)
    this.handleOpacitySlider= this.handleOpacitySlider.bind(this)
  }

  componentDidMount() {
    socket.on('connect', () => {
      console.log("~~~Getting the socket to work in this component!~~~~~")

      //sends commandtype to mobile
      socket.on('getCommandType', () => {
        console.log("get emoticons", this.props.command)
        socket.emit("sendCommand", this.commandType())
      })
    })
  }

  commandType(){ //needed for mobile initial loading
    if(this.props.command === "emoticons"){
      return "emoticons"
    }

    return "touchpad"
  }

  handleClearButton(){
    socket.emit("clearButtonClicked")
  }

  handleWhiteButton(){
    console.log("controller click white")
    this.props.handleSetCommand("white")
    let commandType="touchpad"
    socket.emit('clickedWhiteEllipse', commandType)
  }

  handleColorButton(){
    console.log("controller click color")
    this.props.handleSetCommand("color")
    let commandType="touchpadColor"
    socket.emit('clickedColorEllipse',commandType)
  }

  handleEmoticonsButton(){
    console.log("controller click emoticons")
    this.props.handleSetCommand("emoticons")
    let commandType="emoticons"
    socket.emit('clickedEmoticons', commandType)
  }

  handleTapButton() {
    this.props.handleSetCommand("tap")
    let commandType="tap"
    socket.emit('clickedTap', commandType)
  }

  handleSliderButton() {
    this.props.handleSetCommand("slider")
    let commandType="slider"
    socket.emit('clickedSlider', commandType)
  }

  handleOpacitySlider(event){
    socket.emit('changeOpacity', event.target.value/100)
  }

  render() {
    // console.log("command current", this.props.command);
    return (
      <div>
        <h4>Controllerrrr</h4>
        <button onClick={this.handleWhiteButton}>White Ellipse</button>
        <button onClick={this.handleColorButton}>Color Ellipse</button>
        <button onClick={this.handleEmoticonsButton}>Emoticons</button>
        <button onClick={this.handleTapButton}>Tap</button>
        <button onClick={this.handleSliderButton}>Slider</button>
        <button onClick={this.handleClearButton}>Clear</button>
        <div>
          <SliderComponent handleChange={this.handleOpacitySlider}/>
        </div>
  </div>
    )
  }
}

const mapStateToProps=state => {
  return {
    command: state.command
  }
}

const mapDispatchToProps=dispatch => {
  return {
    handleSetCommand (command) {
      return dispatch(setCommand(command))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Controller);
