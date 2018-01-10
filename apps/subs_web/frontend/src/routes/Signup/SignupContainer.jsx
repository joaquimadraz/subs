import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import RemoteCall from 'data/domain/RemoteCall'
import signupAction, { SIGNUP_RESET } from 'data/domain/signup/action'

import Signup from './Signup'

class SignupContainer extends Component {
  constructor() {
    super()

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)

    this.state = {
      data: {
        email: '',
        password: '',
        password_confirmation: '',
      },
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: SIGNUP_RESET })
  }

  handleFormSubmit() {
    this.props.dispatch(signupAction({ user: this.state.data }))
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const newState = prevState
      newState.data[attribute] = value
      return newState
    })
  }

  render() {
    const { user, remoteCall } = this.props
    const { data } = this.state

    return (
      <Signup
        user={user}
        data={data}
        remoteCall={remoteCall}
        onClick={this.handleFormSubmit}
        onChange={this.handleFormChange}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const user = Map({
    signed_up_email: state.signup.get('signed_up_email'),
    confirmation_sent_at: state.signup.get('confirmation_sent_at'),
  })

  return {
    user,
    remoteCall: state.signup.get('remoteCall'),
  }
}

SignupContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(Map).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
}

export default connect(mapStateToProps)(SignupContainer)
