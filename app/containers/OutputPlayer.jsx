import React, {Component} from 'react'
import {connect} from 'react-redux'
import YouTube from 'react-youtube'
import $ from 'jquery'

var socket = io(window.location.origin)

class OutputPlayer extends Component {
  constructor(props) {
    super(props)
    let Direction = props.direction
    this.state = {
      [`video${Direction}`]: {},
      [`video${Direction}Id`]: '',
      [`queue${Direction}`]: props.queue

    }

    this.handleVideoReady = this.handleVideoReady.bind(this)
    this.handleVideoPlay = this.handleVideoPlay.bind(this)
    this.reinitializeVideo = this.reinitializeVideo.bind(this)
    this.handleVideoEnd = this.handleVideoEnd.bind(this)
  }

  componentDidMount() {
    let Direction = this.props.direction
    socket.emit('outputScreenMounted')

    socket.on(`sendVideo${Direction}ToOutput`, videoId => {
      // console.log(`${Direction}: `, videoId)
      // this.setState({
      //   [`video${Direction}Id`]: videoId
      // })
    })


    socket.on(`playOutputVideo${Direction}`, newCueTime => {
      // console.log('gettin here?')
      this.state[`video${Direction}`].seekTo(newCueTime)
      this.state[`video${Direction}`].playVideo()
    })

    socket.on(`pauseOutputVideo${Direction}`, newCueTime => {
      // console.log('gettin here?')
      this.state[`video${Direction}`].pauseVideo()
    })

    socket.on(`changeOutputVideo${Direction}PlaybackRate`, newRate => {
        console.log(newRate)
        this.state[`video${Direction}`].setPlaybackRate(newRate)
    })

    socket.on('clearOutputVideos', () => {
      this.setState({
        [`video${Direction}Id`]: ''
      })
    })

    socket.on('changeOutputOpacity', (opacity) => {
      $(document).ready(() => {
        $('.youtube1').css('opacity', opacity)
      })
    })

    socket.on('skipVideo', (direction) => {
      if(direction === Direction){
        this.handleVideoEnd();
      }
    })


  }

  handleVideoReady(event) {
    socket.on(`seekTo${this.props.direction}`, cueTime => {
      event.target.seekTo(cueTime)
    })

    this.reinitializeVideo(event)
    setTimeout(() => {
      event.target.setPlaybackQuality('small')
      event.target.pauseVideo()
      event.target.setVolume(0)
      event.target.setPlaybackRate(1)
    }, 100)
  }

  handleVideoPlay(event) {
    // let Direction = this.props.direction,
    //  cueTime = event.target.getCurrentTime()
    //  event.target.setVolume(0)
    //  event.target.setPlaybackQuality('small')
    //  if (cueTime < .5) {
    //    event.target.pauseVideo()
    //  }
  }

  handleVideoEnd(){

    let Direction= this.props.direction,
      newQueue=this.state[`queue${Direction}`].slice(1)
    console.log("getting to handle Video END", newQueue)

    this.setState({
      [`queue${Direction}`]: newQueue
    })
  }

  reinitializeVideo(event) {
    let Direction = this.props.direction
    this.setState({
      [`video${Direction}`]: event.target

    })
    console.log('reinitializing ', this.state)
  }

  render() {
    let Direction = this.props.direction,
      queue = this.props.queue

    const playerOptions = {
      width: window.innerWidth,
      height: window.innerHeight,
      playerVars: {
        autoplay: 1,
        cc_load_policy: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showInfo: 0
      }
    }

    return (
      <YouTube
        videoId={this.state[`queue${Direction}`].length ? this.state[`queue${Direction}`][0].id.videoId : ''}
        opts={playerOptions}
        onReady={this.handleVideoReady}
        onStateChange={this.reinitializeVideo}
        onPlay={this.handleVideoPlay}
        onEnd={this.handleVideoEnd}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  player: state.player[`${ownProps.direction}`],
  queue: state.queue[`${ownProps.direction}`]
})

export default connect(mapStateToProps)(OutputPlayer)
