import React, {Component} from 'react'
import {connect} from 'react-redux'
import YouTube from 'react-youtube'
import {addToSet} from 'APP/app/reducers/set'
import {savePlayer} from 'APP/app/reducers/player'
import {removeFromQueue} from 'APP/app/reducers/queue'

var socket = io(window.location.origin)

class Player extends Component {
  constructor(props) {
    super(props)
    let Direction = props.direction
    this.state = {
      [`video${Direction}`]: {}
    }

    this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this)
    this.handleVideoReady = this.handleVideoReady.bind(this)
    this.handleVideoPlay = this.handleVideoPlay.bind(this)
    this.handleVideoPause = this.handleVideoPause.bind(this)
    this.handlePlaybackRateChange = this.handlePlaybackRateChange.bind(this)
    this.handleVideoEnd = this.handleVideoEnd.bind(this)
    this.handleVolumeChange=this.handleVolumeChange.bind(this)
  }

  componentDidMount() {
    // console.log('PROPS', this.props)
  }

  handleVideoReady(event) {
    let Direction = this.props.direction,
      cueTime = event.target.getCurrentTime(),
      videoToEmit = this.props.queue.length ? this.props.queue[0].id.videoId : ''

      this.setState({[`video${Direction}`]: event.target})


    socket.on('outputReadyForPlayerVideos', () => {
      socket.emit(`sendCueTimeToOutput${Direction}`, cueTime,)
    })

    /*socket listeners for dj video controls*/
    socket.on('skipVideo', (direction) => {
      if(direction === Direction){
        this.handleVideoEnd();
      }
    })

    socket.on('updatePlaybackRate', (newRate) => {
      console.log("Changing the playback rate", newRate)
      event.target.setPlaybackRate(newRate)
    })

    socket.on('changeVideosVolume', (newVol) => {
      console.log("Changing the volume", newVol)
      this.handleVolumeChange(newVol, event.target);
    })

    setTimeout(() => {
      event.target.pauseVideo()
      event.target.setPlaybackQuality('small')
    }, 100)

    socket.emit(`playerMounted${Direction}`, videoToEmit)
  }

  handleVideoPlay(event) {
    let Direction = this.props.direction,
      cueTime = event.target.getCurrentTime()
    socket.emit(`playingVideo${Direction}`, cueTime)
  }

  handleVideoPause(event) {
    let Direction = this.props.direction,
      newCueTime = event.target.getCurrentTime()
    socket.emit(`pausingVideo${Direction}`, newCueTime)
    // this.props.savePlayer(Object.assign({}, event), `player${Direction}`)
  }

  handlePlaybackRateChange(event) {
    let Direction = this.props.direction,
      newRate = event.data

    // console.log(newRate)

    socket.emit(`changingVideo${Direction}PlaybackRate`, newRate)
  }

  handleVolumeChange(newVol, video){
    let Direction= this.props.direction

    if(Direction === "Right"){
      if (newVol <= 100) {
        this.state[`video${Direction}`].setVolume(newVol)
      }
    } else {
      if (newVol > 100) {
        this.state[`video${Direction}`].setVolume(200-newVol)
      }else if(newVol === 100){
        this.state[`video${Direction}`].setVolume(100)
      }
    }

  }

  handleVideoEnd() {
    let video = this.state[`video${this.props.direction}`],
      setItem = {
        "direction": this.props.direction,
        "videoId": this.props.queue[0].id.videoId,
        "title": this.props.queue[0].snippet.title,
        "thumbnailUrl": this.props.queue[0].snippet.thumbnails.default.url
      }

    // console.log(this.state)
    // console.log('SET ITEM: ', setItem)
    // console.log("props direction", this.props.direction)

    this.props.addToSet(setItem)
    this.props.removeFromQueue(0, `queue${this.props.direction}`)
  }

  handlePlayerStateChange(event) {
    let Direction = this.props.direction

    // switch (event.data) {
    //  case -1:
    //    this.props.savePlayer(event.target, `player${Direction}`)
    // }

    console.log('reinitializing',event)
  }

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
        videoId={queue && queue.length ? queue[0].id.videoId : ''}
        opts={playerOptions}
        onReady={this.handleVideoReady}
        onPlay={this.handleVideoPlay}
        onPause={this.handleVideoPause}
        onPlaybackRateChange={this.handlePlaybackRateChange}
        onEnd={this.handleVideoEnd}
        onStateChange={this.handlePlayerStateChange}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  player: state.player[`${ownProps.direction}`],
  queue: state.queue[`${ownProps.direction}`],
  set: state.set
})

const mapDispatchToProps = dispatch => ({
  addToSet: setItem => {
    dispatch(addToSet(setItem))
  },
  removeFromQueue: (videoId, direction) => {
    dispatch(removeFromQueue(videoId, direction))
  },
  savePlayer: (player, direction) => {
    // console.log('SAVING PLAYER??!??!?', player, direction)
    dispatch(savePlayer(player, direction))
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
