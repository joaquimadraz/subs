import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RemoteCall from 'data/domain/RemoteCall'
import checkRecoveryTokenAction from 'data/domain/password/checkRecoveryToken/action'
import resetPasswordAction from 'data/domain/password/resetPassword/action'

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

  componentDidMount() {
    const { dispatch, location: { query: { t } } } = this.props

    dispatch(checkRecoveryTokenAction(t))
  }

  handleFormSubmit() {
    const { dispatch, location: { query: { t } } } = this.props
    const { data } = this.state

    dispatch(resetPasswordAction(t, data))
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const newState = prevState
      newState.data[attribute] = value
      return newState
    })
  }

  render() {
    const { data } = this.state

    const {
      wasPasswordUpdated,
      wasTokenChecked,
      isTokenValid,
      remoteCall,
    } = this.props

    if (!wasTokenChecked) {
      return <p>Loading</p>
    }

    if (wasPasswordUpdated) {
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
    wasPasswordUpdated: state.password.get('wasPasswordUpdated'),
    wasTokenChecked: state.password.get('wasTokenChecked'),
    isTokenValid: state.password.get('isTokenValid'),
    remoteCall: state.password.get('remoteCall'),
  }
}

ResetPasswordContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  wasPasswordUpdated: PropTypes.bool.isRequired,
  wasTokenChecked: PropTypes.bool.isRequired,
  isTokenValid: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(ResetPasswordContainer)
