import React from 'react'
import PropTypes from 'prop-types'

import RemoteCall from 'data/domain/RemoteCall'
import ErrorMessages from 'components/ErrorMessages'
import Button from 'components/Button'
import InputText from 'components/InputText'

const renderErrors = (remoteCall) => {
  if (remoteCall.loading || !remoteCall.data) { return null }

  return <ErrorMessages errors={remoteCall.data.get('errors')} />
}

const ResetPasswordForm = ({
  data,
  onClick,
  onChange,
  remoteCall,
}) => {
  const handleChange = (event, attribute) => {
    onChange(attribute, event.target.value)
  }

  return (
    <div id="reset-password-form">
      {renderErrors(remoteCall)}

      <legend className="f4 fw6 ph0 mh0 subs-pink-darker">Reset password</legend>
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
        <Button id="reset-btn" onClick={onClick}>
          Reset password
        </Button>
      </div>
    </div>
  )
}

ResetPasswordForm.propTypes = {
  data: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
}

ResetPasswordForm.defaultProps = {
  onClick: () => { },
  onChange: () => {},
}

export default ResetPasswordForm
