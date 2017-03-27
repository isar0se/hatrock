module.exports = function(io) {
  io.on('connection', function(playerSocket) {
    playerSocket.on('playerMountedLeft', video => {
      playerSocket.broadcast.emit('sendVideoLeftToOutput', video)
    })

    playerSocket.on('playerMountedRight', video => {
      playerSocket.broadcast.emit('sendVideoRightToOutput', video)
    })
    
    playerSocket.on('playingVideoLeft', cueTime => {
      playerSocket.broadcast.emit('playOutputVideoLeft', cueTime)
    })
    
    playerSocket.on('playingVideoRight', cueTime => {
      playerSocket.broadcast.emit('playOutputVideoRight', cueTime)
    })
    
    playerSocket.on('pausingVideoLeft', cueTime => {
      playerSocket.broadcast.emit('pauseOutputVideoLeft', cueTime)
    })
    
    playerSocket.on('pausingVideoRight', cueTime => {
      playerSocket.broadcast.emit('pauseOutputVideoRight', cueTime)
    })
    
    playerSocket.on('changingVideoLeftPlaybackRate', newRate => {
      playerSocket.broadcast.emit('changeOutputVideoLeftPlaybackRate', newRate)
    })
    
    playerSocket.on('changingVideoRightPlaybackRate', newRate => {
      playerSocket.broadcast.emit('changeOutputVideoRightPlaybackRate', newRate)
    })
    
    playerSocket.on('clearVideos', () => {
      playerSocket.broadcast.emit('clearOutputVideos')
    })
  })
}
