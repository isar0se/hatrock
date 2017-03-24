import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {Button, Dropdown, Menu} from 'semantic-ui-react'
import {logout} from 'APP/app/reducers/auth'
import {fetchPlaylists} from 'APP/app/reducers/playlists'
import axios from 'axios'

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
          <Dropdown.Item
            onClick={()=>{
              axios.get(`/api/auth/users/${this.props.user.id}`)
                .then(res => {
                  let accessToken = res.data.accessToken
                  return axios.get(`https://www.googleapis.com/youtube/v3/playlists?access_token=${accessToken}&part=snippet&mine=true`)
                  })
                  .then(res => {
                    console.log('playlists response: ',res.data)
                }).catch(console.error)
            }}>Import Playlists
          </Dropdown.Item>
          <Dropdown.Item>View Your Sets
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  renderLogin() {
    return (
      <Menu.Item><Button basic href='/api/auth/login/google'>Login</Button></Menu.Item>
    )
  }

  renderLogout() {
    const user = this.props.user
    return (
      <Menu.Item>
        <Button basic onClick={this.props.logout}>Logout</Button></Menu.Item>
    )
  }

  render() {
    const user = this.props.user
    return (
      <Menu.Menu position='right'>
        {user ? this.renderUser() : null}
        {user ? this.renderLogout() : this.renderLogin()}
      </Menu.Menu>
    )
  }
}

const mapStateToProps = ({auth}) => ({
  user: auth
})

export default connect(mapStateToProps, {logout, fetchPlaylists})(LoginLogout)
