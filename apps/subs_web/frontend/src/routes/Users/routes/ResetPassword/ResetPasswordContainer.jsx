import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import api from 'data/api'
import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'

import ResetPassword from './ResetPassword'

class ResetPasswordContainer extends Component {
  constructor() {
    super()

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)

    this.state = {
      data: {
        password: '',
        password_confirmation: '',
      },
    }
  }

  handleFormSubmit() {
    const { location: { query: { t } } } = this.props
    const { data } = this.state

    api.postUsersResetPassword(t, data)
      .then(() => {
        // TODO
      })
      .catch((error) => {
        const remoteCall = parseErrorResponse(error)
        this.setState(() => ({ message: remoteCall.get('message') }))
      })
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const newState = prevState
      newState.data[attribute] = value
      return newState
    })
  }

  render() {
    const { remoteCall } = this.props
    const { data } = this.state

    return (
      <ResetPassword
        remoteCall={remoteCall}
        data={data}
        onClick={this.handleFormSubmit}
        onChange={this.handleFormChange}
      />
    )
  }
}

const mapStateToProps = () => {
  return {
    remoteCall: new RemoteCall(),
  }
}

ResetPasswordContainer.propTypes = {
  location: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
}

export default connect(mapStateToProps)(ResetPasswordContainer)
