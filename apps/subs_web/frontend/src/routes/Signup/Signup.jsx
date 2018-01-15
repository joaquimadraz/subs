import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'

import RemoteCall from 'data/domain/RemoteCall'
import ErrorMessages from 'components/ErrorMessages'
import Button from 'components/Button'
import InputText from 'components/InputText'
import InputSelect from 'components/InputSelect'

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
  data,
  remoteCall,
}) => {
  const handleSelectChange = (select, attribute) => {
    onChange(attribute, select.value)
  }

  const handleChange = (event, attribute) => {
    onChange(attribute, event.target.value)
  }

  if (user.get('confirmation_sent_at')) {
    return renderSuccessMessage(user)
  }

  return (
    <div id="signup-form" className="measure center pa3 bg-near-white br2">
      {renderErrors(remoteCall)}
      <legend className="f4 fw6 ph0 mh0 subs-pink-darker">Sign up</legend>
      <div className="mt3">
        <div className="f5 b dark-gray mb2 mt3">
          Email
        </div>
        <InputText
          className="user-email br2 pa2 input-reset ba w-100"
          type="email"
          value={data.email}
          onChange={event => handleChange(event, 'email')}
        />
      </div>
      <div className="mt3">
        <div className="f5 b dark-gray mb2 mt3">
          Currency
        </div>
        <InputSelect
          className="user-currency"
          onChange={event => handleSelectChange(event, 'currency')}
          value={data.currency}
          options={[
            { value: 'GBP', label: '£ (GBP)' },
            { value: 'EUR', label: '€ (EUR)' },
            { value: 'USD', label: '$ (USD)' },
          ]}
        />
      </div>
      <div className="mv3">
        <div className="f5 b dark-gray mb2 mt3">
          Password
        </div>
        <InputText
          className="user-password br2 pa2 input-reset ba w-100"
          type="password"
          value={data.password}
          onChange={event => handleChange(event, 'password')}
        />
      </div>
      <div className="mv3">
        <div className="f5 b dark-gray mb2 mt3">
          Password confirmation
        </div>
        <InputText
          className="user-password-confirmation br2 pa2 input-reset ba w-100"
          type="password"
          value={data.password_confirmation}
          onChange={event => handleChange(event, 'password_confirmation')}
        />
      </div>
      <div>
        <Button id="signup-btn" onClick={onClick}>
          Sign up
        </Button>
      </div>
    </div>
  )
}

Signup.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
}

Signup.defaultProps = {
  onClick: () => {},
  onChange: () => { },
}

export default Signup
