import React, { Component } from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { List } from 'semantic-ui-react';
import SortableQueueItem from './SortableQueueItem';

const listItemStyle = {
  maxWidth: "120px",
  verticalAlign: "top",
  wordWrap: "break-word",
  whiteSpace: "normal",
}

const SortableItem = SortableElement(({value}) => {
  return (
    <List.Item style={listItemStyle}>
      <SortableQueueItem video={value} style={{wordWrap: "break-word", whiteSpace: "normal"}}/>      
      </List.Item>
  )
});



const SortableList = SortableContainer(({videos}) => {
  return (
    <List horizontal style={{whiteSpace: "nowrap", overflowX: "auto", overflowY: "hidden"}}>
      {videos.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </List>
  );
});

export default class SortableQueue extends Component {
  constructor(props) {
    let Direction = props.direction
    super(props)
    this.state = {
      videos: [
        { title: 'This Is A Right Video Title', thumbnail: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=120x90&w=120&h=90'}, 
        { title: 'Here Is Right Another One', thumbnail: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=120x90&w=120&h=90'}, 
        { title: 'More Video Right Titles Here', thumbnail: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=120x90&w=120&h=90'},
        { title: 'Here Is Right Another One', thumbnail: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=120x90&w=120&h=90'}, 
      ],
    }
  }

    onSortEnd = ({oldIndex, newIndex}) => {
      this.setState({
        videos: arrayMove(this.state.videos, oldIndex, newIndex),
      });
    };
  render() {
    return (
        <SortableList axis="x" videos={this.state.videos} onSortEnd={this.onSortEnd} />
    );
  }
}
