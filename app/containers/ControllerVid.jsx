import React, { Component } from 'react'
import SliderComponent from 'APP/app/components/SliderComponent'

/*~~~DJ CONTROLS TO AFFECT OUTPUT SCREEN~~~*/

var socket = io(window.location.origin)

export default class ControllerVid extends Component {

  constructor(){
    super()
    this.handleOpacitySlider= this.handleOpacitySlider.bind(this)
  }

  handleVolumeSlider(event){
    socket.emit('changeVolume', event.target.value*2);
  }

  handleOpacitySlider(event){
    socket.emit('changeOpacity', event.target.value/100)
  }

  handleSkipVideo(direction){
    socket.emit('skipVideoPressed', direction)
  }

  render() {
    // console.log("command current", this.props.command);
    return (
      <div className="djControls">
        <h2>Video Controls</h2>
        <div className="djControlButtons">
          <button onClick={()=>this.handleSkipVideo("Left")}>Skip Left</button>
          <div className="sliders">
            <SliderComponent  handleChange={this.handleOpacitySlider}/>
            <p>Opacity</p>
            <SliderComponent  handleChange={this.handleVolumeSlider}/>
            <p>Volume</p>
          </div>
          <button onClick={()=>this.handleSkipVideo("Right")}>Skip Right</button>
        </div>
      </div>
    )
  }
}
