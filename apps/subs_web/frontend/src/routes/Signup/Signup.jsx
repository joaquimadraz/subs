import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'

import RemoteCall from 'data/domain/RemoteCall'
import ErrorMessages from 'components/ErrorMessages'

const renderErrors = (remoteCall) => {
  if (remoteCall.loading || !remoteCall.data) { return null }

  return <ErrorMessages errors={remoteCall.data.get('errors')} />
}

const renderSuccessMessage = user => (
  <div>
    <p>A confirmation email was sent to {user.get('signed_up_email')}.</p>
    <p>Check your email to confirm your account.</p>
  </div>
)

const Signup = ({
  onClick,
  onChange,
  user,
  remoteCall,
}) => {
  const handleChange = (event, attribute) => {
    onChange(attribute, event.target.value)
  }

  if (user.get('confirmation_sent_at')) {
    return renderSuccessMessage(user)
  }

  return (
    <div>
      Signup

      <div id="signup-form">
        {renderErrors(remoteCall)}
        <input
          className="user-email"
          type="email"
          placeholder="email"
          onChange={event => handleChange(event, 'email')}
        />
        <input
          className="user-password"
          type="password"
          placeholder="password"
          onChange={event => handleChange(event, 'password')}
        />
        <input
          className="user-password-confirmation"
          type="password"
          placeholder="password confirmation"
          onChange={event => handleChange(event, 'password_confirmation')}
        />
        <button id="signup-btn" onClick={onClick}>Let’s go!</button>
      </div>
    </div>
  )
}

Signup.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
}

Signup.defaultProps = {
  onClick: () => {},
  onChange: () => { },
}

export default Signup
