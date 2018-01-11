import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RemoteCall from 'data/domain/RemoteCall'
import loginAction, { LOGIN_RESET } from 'data/domain/login/login/action'
import recoverPasswordAction from 'data/domain/login/recoverPassword/action'
import Button from 'components/Button'

import Login from './Login'
import RecoverPassword from './RecoverPassword'

const initialLoginData = {
  email: '',
  password: '',
}

class LoginContainer extends Component {
  constructor() {
    super()

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)

    this.handleRecoverPasswordFormChange = this.handleRecoverPasswordFormChange.bind(this)
    this.handleRecoverFormSubmit = this.handleRecoverFormSubmit.bind(this)

    this.setRecoverPassword = this.setRecoverPassword.bind(this)
    this.setLogin = this.setLogin.bind(this)

    this.state = {
      isLogin: true,
      loginData: initialLoginData,
      recoverEmail: '',
    }
  }

  setRecoverPassword() {
    this.props.dispatch({ type: LOGIN_RESET })

    this.setState(() => ({
      isLogin: false,
      loginData: initialLoginData,
    }))
  }

  setLogin() {
    this.props.dispatch({ type: LOGIN_RESET })

    this.setState(() => ({
      isLogin: true,
      recoverEmail: '',
    }))
  }

  handleFormSubmit() {
    const { dispatch, location: { query: { r: redirectUrl } } } = this.props
    const { email, password } = this.state.loginData

    dispatch(loginAction(email, password, { redirectUrl }))
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const newState = prevState
      newState.loginData[attribute] = value
      return newState
    })
  }

  handleRecoverPasswordFormChange(email) {
    this.setState(() => ({ recoverEmail: email }))
  }

  handleRecoverFormSubmit() {
    const { dispatch } = this.props
    const { recoverEmail } = this.state

    dispatch(recoverPasswordAction(recoverEmail))
  }

  renderLogin() {
    const { remoteCall } = this.props
    const { loginData } = this.state

    return (
      <Login
        data={loginData}
        remoteCall={remoteCall}
        onClick={this.handleFormSubmit}
        onChange={this.handleFormChange}
      >
        <button
          className="bg-transparent pa0 bn dark-gray b pointer"
          onClick={this.setRecoverPassword}
        >
          Recover password
        </button>
      </Login>
    )
  }

  renderRecoverPassword() {
    const { remoteCall } = this.props
    const { recoverEmail } = this.state

    return (
      <div>
        <RecoverPassword
          data={{ email: recoverEmail }}
          remoteCall={remoteCall}
          onChange={this.handleRecoverPasswordFormChange}
          onClick={this.handleRecoverFormSubmit}
        >
          <Button
            onClick={this.setLogin}
            color="dark-gray"
            className="silver mt2 mt0-ns"
          >
            Cancel
          </Button>
        </RecoverPassword>
      </div>
    )
  }

  render() {
    const { isLogin } = this.state

    return (
      <div>
        {isLogin ? this.renderLogin() : this.renderRecoverPassword()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    remoteCall: state.login.get('remoteCall'),
  }
}

LoginContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
}

export default connect(mapStateToProps)(LoginContainer)
