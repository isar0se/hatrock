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
      [`video${Direction}Id`]: ''
    }

    this.handleVideoReady = this.handleVideoReady.bind(this)
    this.reinitializeVideo = this.reinitializeVideo.bind(this)
  }

  componentDidMount() {
    let Direction = this.props.direction
    socket.on('connect', () => {
      // console.log('output socket is live!')
      socket.emit('outputScreenMounted')
    })

    socket.on(`sendVideo${Direction}ToOutput`, videoId => {
      // console.log(`${Direction}: `, videoId)
      this.setState({
        [`video${Direction}Id`]: videoId
      })
      //  console.log('gettin hre?')
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
  }

  handleVideoReady(event) {
    this.reinitializeVideo(event)
    setTimeout(() => {
      event.target.pauseVideo()
    }, 100)
  }

  reinitializeVideo(event) {
    event.target.setPlaybackQuality('small')
    event.target.setVolume(0)
    let Direction = this.props.direction
    this.setState({
      [`video${Direction}`]: event.target
    })
  }

  render() {
    let Direction = this.props.direction,
      queue = this.props.queue
      console.log('QUEUE',queue)
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
        videoId={queue.length ? queue[0].id.videoId : ''}
        opts={playerOptions}
        onReady={this.handleVideoReady}
        onStateChange={this.reinitializeVideo}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  queue: state[`queue${ownProps.direction}`]
})

export default connect(mapStateToProps)(OutputPlayer)
