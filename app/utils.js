export const concatQueuesToSet = (setArray, queueLeft, queueRight) => {
  let setCopy = setArray
  
  for (let i = 0; i < (queueLeft.length > queueRight.length ? queueLeft.length : queueRight.length); i++) {
    
    if (queueLeft[i]) {
      setCopy.push({
        direction: 'Left',
        thumbnailUrl: queueLeft[i].snippet.thumbnails.default.url,
        title: queueLeft[i].snippet.title,
        videoId: queueLeft[i].id.videoId
      })
    }
    
    if (queueRight[i]) {
      setCopy.push({
        direction: 'Right',
        thumbnailUrl: queueRight[i].snippet.thumbnails.default.url,
        title: queueRight[i].snippet.title,
        videoId: queueRight[i].id.videoId
      })
    }
  }
  
  return setCopy
}

export const lastTwoSecondsOfTaps = tapsArray => (
  tapsArray.filter(tapTime => Date.now() - tapTime <= 2000) 
)