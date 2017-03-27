import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Menu} from 'semantic-ui-react'

class Queue extends Component {
  constructor(props) {
    super(props)
    this.renderQueue = this.renderQueue.bind(this)
  }
  
  renderQueue() {
    const queue = this.props.queue
    if (queue.length) {
      console.log('rendering queue: ', queue)
      return (
        queue.map((queueItem, idx) => 
          <Menu.Item
            key={idx}
            name={queueItem.snippet.title}
          />
        )
      )
    }
  }
  
  render() {
    const queue = this.props.queue
    return (
      <ul>
        {queue.map((queueItem, idx) => {
          console.log('MAPPPINGGGG')
          return (
            <li key={idx}>{queueItem.snippet.title}</li>
          )
        })}
      </ul>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({queue: state[`queue${ownProps.direction}`]
})

export default connect(mapStateToProps)(Queue)

// Menu fixed='bottom' inverted={true}