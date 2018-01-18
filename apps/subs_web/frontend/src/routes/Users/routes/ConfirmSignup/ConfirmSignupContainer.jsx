import React, { Component } from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'

import api from 'data/api'
import routes from 'constants/routes'
import { parseErrorResponse } from 'data/domain/RemoteCall'

class ConfirmSignupContainer extends Component {
  constructor() {
    super()

    this.state = {
      loading: true,
      message: 'Confirming...',
    }
  }

  componentDidMount() {
    const { location: { query: { t } } } = this.props

    api.postUsersConfirm({ t })
      .then(() => {
        this.setState(() => ({
          loading: false,
          message: 'Account confirmed, ready to login'
        }))
      })
      .catch((error) => {
        const remoteCall = parseErrorResponse(error)
        this.setState(() => ({
          loading: false,
          message: remoteCall.get('message'),
        }))
      })
  }

  render() {
    const { loading, message } = this.state

    return (
      <div className="measure center pa3 bg-white br2 ba b--black shadow-5">
        <p>{message}</p>
        {!loading && <p>Go back <Link to={routes.root} className="white link subs-blue">home</Link></p>}
      </div>
    )
  }
}

ConfirmSignupContainer.propTypes = {
  location: PropTypes.object.isRequired,
}

export default ConfirmSignupContainer
