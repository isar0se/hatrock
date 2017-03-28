import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {Button, Icon, Dropdown, Menu} from 'semantic-ui-react'
import {logout} from 'APP/app/reducers/auth'
import {fetchPlaylists} from 'APP/app/reducers/playlists'
import axios from 'axios'
import {loadYoutubePlaylist} from 'APP/app/reducers/queue'
import {fetchAllSetsFromDb} from '../reducers/sets'
import FetchSetModal from 'APP/app/components/FetchSetModal'
import SaveSetModal from 'APP/app/components/SaveSetModal'

class LoginLogout extends Component {
  constructor(props) {
    super(props)
    this.renderLogin = this.renderLogin.bind(this)
    this.renderUser = this.renderUser.bind(this)
    this.renderLogout = this.renderLogout.bind(this)
  }

  renderUser() {
    const user = this.props.user
    return (
      <Dropdown text={`Hello ${user.name || user.email}!`} className='link item'>
        <Dropdown.Menu>
          <SaveSetModal/>
          <FetchSetModal/>
        <Dropdown.Item
            onClick={()=>{
              let accessToken;
              axios.get(`/api/auth/users/${this.props.user.id}`)
                .then(res => {
                  accessToken = res.data.accessToken
                  return axios.get(`https://www.googleapis.com/youtube/v3/playlists?access_token=${accessToken}&part=snippet&mine=true`)
                })
                .then(res => {
                  console.log('playlists response: ',res.data)
                  let playlistId = res.data.items[1].id
                  return axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?access_token=${accessToken}&part=snippet&maxResults=50&playlistId=${playlistId}`)
                }).then((res) => {
                  console.log("playlist items??", res.data)
                  this.props.loadYoutubePlaylist(res.data.items)
                }).catch(console.error)
            }}>Load Youtube Playlists
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  renderLogin() {
    return (
      <Button content="Login with Google" icon={'youtube'} color={'youtube'} href='/api/auth/login/google' style={{position: "relative", left: "-40px", width: "60%", maxWidth: "300px"}}></Button>
    )
  }

  renderLogout() {
    const user = this.props.user
    return (
      <Menu.Item>
        <Button onClick={this.props.logout}>Logout</Button></Menu.Item>
    )
  }

  render() {
    const user = this.props.user
    return (
      <Menu.Item>
        {user ? this.renderUser() : null}
        {user ? this.renderLogout() : this.renderLogin()}
      </Menu.Item>
    )
  }
}

const mapStateToProps = ({auth}) => ({
  user: auth
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch(logout())
  },
  loadYoutubePlaylist: playlistItems => {
    dispatch(loadYoutubePlaylist(playlistItems))
  },
  fetchAllSetsFromDb: (userId) => { dispatch(fetchAllSetsFromDb(userId)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginLogout)
