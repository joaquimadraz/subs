import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import api from 'data/api'
import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'
import checkRecoveryTokenAction from 'data/domain/password/checkRecoveryToken/action'

import ResetPassword from './ResetPassword'

class ResetPasswordContainer extends Component {
  constructor() {
    super()

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)

    this.state = {
      passwordUpdated: false,
      data: {
        password: '',
        password_confirmation: '',
      },
    }
  }

  componentDidMount() {
    const { dispatch, location: { query: { t } } } = this.props

    dispatch(checkRecoveryTokenAction(t))
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
      data,
      passwordUpdated,
    } = this.state

    const {
      wasTokenChecked,
      isTokenValid,
      remoteCall,
    } = this.props

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

const mapStateToProps = (state) => {
  return {
    wasTokenChecked: state.password.get('wasTokenChecked'),
    isTokenValid: state.password.get('isTokenValid'),
    remoteCall: state.password.get('remoteCall'),
  }
}

ResetPasswordContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  wasTokenChecked: PropTypes.bool.isRequired,
  isTokenValid: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(ResetPasswordContainer)
