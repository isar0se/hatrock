import React, {Component} from 'react'
import {connect} from 'react-redux'
import YouTube from 'react-youtube'
import {addToSet} from 'APP/app/reducers/set'
import {removeFromQueue} from 'APP/app/utils/queue'

var socket = io(window.location.origin)

class Player extends Component {
  constructor(props) {
    let Direction = props.direction
    super(props)
    this.state = {
      [`video${Direction}`]: {}
    }

    // this.reinitializeVideo = this.reinitializeVideo.bind(this)
    this.handleVideoReady = this.handleVideoReady.bind(this)
    this.handleVideoPlay = this.handleVideoPlay.bind(this)
    this.handleVideoPause = this.handleVideoPause.bind(this)
    this.handlePlaybackRateChange = this.handlePlaybackRateChange.bind(this)
    this.handleVideoEnd = this.handleVideoEnd.bind(this)
  }

  componentDidMount() {
    let Direction = this.props.direction,
      videoToEmit = this.props.queue[0] ? this.props.queue[0].id.videoId : ''
  }

  handleVideoReady(event) {
    let Direction = this.props.direction,
      videoToEmit = this.props.queue.length ? this.props.queue[0].id.videoId : ''

    setTimeout(() => {
      event.target.pauseVideo()
      event.target.setPlaybackQuality('small')
    }, 100)
    // console.log('VIDEO THAT WE EMIT', videoToEmit)
    socket.emit(`playerMounted${Direction}`, videoToEmit)
  }

  handleVideoPlay(event) {
    let Direction = this.props.direction,
      newCueTime = event.target.getCurrentTime()
    // this.reinitializeVideo(event)
    socket.emit(`playingVideo${Direction}`, newCueTime)
    // console.log('video? ',event.target)
    // this.setState({
    //  [`video${Direction}`]: event.target
    // })
  }

  handleVideoPause(event) {
    let Direction = this.props.direction,
      newCueTime = event.target.getCurrentTime()
    // this.reinitializeVideo(event)
    socket.emit(`pausingVideo${Direction}`, newCueTime)
  }

  handlePlaybackRateChange(event) {
    let Direction = this.props.direction,
      newRate = event.data
    console.log(newRate)
    // this.reinitializeVideo(event)
    socket.emit(`changingVideo${Direction}PlaybackRate`, newRate)
  }

  handleVideoEnd() {

    // 1. save just the info we need to a set on localStorage:
    // videoId, title, thumbnailUrl, direction
    let video = this.state[`video${this.props.direction}`],
      setItem = {
        "direction": this.props.direction,
        "videoId": this.props.queue[0].id.videoId,
        "title": this.props.queue[0].snippet.title,
        "thumbnailUrl": this.props.queue[0].snippet.thumbnails.default.url
      }
    console.log(this.state)
    console.log('SET ITEM: ', setItem)
    this.props.addToSet(setItem)
    console.log("props direction", this.props.direction)
    this.props.removeFromQueue(0, `queue${this.props.direction}`)
  }

  // reinitializeVideo(event) {
  //  event.target.setPlaybackQuality('small')
  //  let Direction = this.props.direction
  //  // console.log(event.target)

  //  this.setState({
  //    [`video${Direction}`]: event.target
  //  })
  // }

  render() {
    let queue = this.props.queue,
      playerOptions = {
      width: window.innerWidth / 2,
      // height: window.innerHeight - 130,
      playerVars: {
        autoplay: 1,
        cc_load_policy: 0,
        controls: 1,
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
        onPlay={this.handleVideoPlay}
        onPause={this.handleVideoPause}
        onPlaybackRateChange={this.handlePlaybackRateChange}
        onEnd={this.handleVideoEnd}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  queue: state[`queue${ownProps.direction}`],
  set: state.set
})

const mapDispatchToProps = dispatch => ({
  addToSet: setItem => {
    dispatch(addToSet(setItem))
  },
  removeFromQueue: (videoId, direction) => {
    dispatch(removeFromQueue(videoId, direction))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Player)

// id={string}
// className={string}
// onReady={func}
// onPlay={func}
// onPause={func}
// onEnd={func}
// onError={func}
// onStateChange={func}
// onPlaybackRateChange={func}
// onPlaybackQualityChange={func}

// get player state:
//-1 (unstarted)
// 0 (ended)
// 1 (playing)
// 2 (paused)
// 3 (buffering)
// 5 (video cued)
