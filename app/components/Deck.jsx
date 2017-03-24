import React from 'react'
import {Container} from 'semantic-ui-react'
import Player from '../containers/Player'
import Queue from '../containers/Queue'
import SortableQueue from '../components/SortableQueue'



export const Deck = props => {

  const queueStyles = {
    marginLeft: "10px",
  }

  return (
  <Container>
    <Player 
      direction={props.direction}
    />
    <div style={queueStyles}>
    <SortableQueue direction={props.direction} />
    </div>
  </Container>
)}

// if we're reusing components, how do we render them with different information ?
