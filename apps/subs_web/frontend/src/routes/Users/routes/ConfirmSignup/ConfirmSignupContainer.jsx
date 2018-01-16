import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from 'data/api'
import { parseErrorResponse } from 'data/domain/RemoteCall'

class ConfirmSignupContainer extends Component {
  constructor() {
    super()

    this.state = { message: 'Confirming...' }
  }

  componentDidMount() {
    const { location: { query: { t } } } = this.props

    api.postUsersConfirm({ t })
      .then(() => {
        this.setState(() => ({ message: 'Account confirmed, ready to login' }))
      })
      .catch((error) => {
        const remoteCall = parseErrorResponse(error)
        this.setState(() => ({ message: remoteCall.get('message') }))
      })
  }

  render() {
    return (
      <div className="measure center pa3 bg-white br2 ba b--black shadow-5">
        <p>{this.state.message}</p>
      </div>
    )
  }
}

ConfirmSignupContainer.propTypes = {
  location: PropTypes.object.isRequired,
}

export default ConfirmSignupContainer
