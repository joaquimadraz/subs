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
      remoteCall: new RemoteCall(),
      wasTokenChecked: false,
      isTokenValid: false,
      passwordUpdated: false,
      data: {
        password: '',
        password_confirmation: '',
      },
    }
  }

  componentDidMount() {
    const { location: { query: { t } } } = this.props

    api.getPasswordReset(t)
      .then(() => {
        this.setState(() => ({ wasTokenChecked: true, isTokenValid: true }))
      })
      .catch((error) => {
        const remoteCall = parseErrorResponse(error)

        this.setState(() => ({ wasTokenChecked: true, remoteCall }))
      })
  }

  handleFormSubmit() {
    const { location: { query: { t } } } = this.props
    const { data } = this.state

    api.postUsersResetPassword(t, data)
      .then((response) => {
        this.setState(() => ({ passwordUpdated: true, remoteCall: new RemoteCall() }))
      })
      .catch((error) => {
        this.setState(() => ({ remoteCall: parseErrorResponse(error) }))
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
    const {
      wasTokenChecked,
      isTokenValid,
      data,
      remoteCall,
      passwordUpdated,
    } = this.state

    if (!wasTokenChecked) {
      return <p>Loading</p>
    }

    if (passwordUpdated) {
      return <p>Password was updated</p>
    }

    return (
      isTokenValid
        ? (
          <ResetPassword
            remoteCall={remoteCall}
            data={data}
            onClick={this.handleFormSubmit}
            onChange={this.handleFormChange}
          />
        )
        : (
          <p>{remoteCall.message}</p>
        )
    )
  }
}

const mapStateToProps = () => {
  return {
    // remoteCall: new RemoteCall(),
  }
}

ResetPasswordContainer.propTypes = {
  location: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
}

export default connect(mapStateToProps)(ResetPasswordContainer)
