import React from 'react'
import PropTypes from 'prop-types'

import RemoteCall from 'data/domain/RemoteCall'
import Message from 'components/Message'
import ErrorMessages from 'components/ErrorMessages'
import InputText from 'components/InputText'
import Button from 'components/Button'

const renderMessage = (remoteCall) => {
  if (remoteCall.loading || !remoteCall.message) { return null }

  return (<Message success>{remoteCall.message}</Message>)
}

const renderErrors = (remoteCall) => {
  if (remoteCall.loading || !remoteCall.data) { return null }

  return <ErrorMessages errors={remoteCall.data.get('errors')} />
}

const RecoverPassword = ({
  onClick,
  onChange,
  remoteCall,
  data,
  children,
}) => {
  return (
    <div id="recover-password-form" className="measure center pa3 bg-near-white br2">
      {renderErrors(remoteCall)}
      {renderMessage(remoteCall)}
      <legend className="f4 fw6 ph0 mh0 subs-pink-darker">Recover password</legend>

      <div className="mv3">
        <div className="f5 b dark-gray mb2 mt3">
          Email
        </div>
        <InputText
          className="user-email br2 pa2 input-reset ba w-100"
          type="email"
          value={data.email}
          onChange={event => onChange(event.target.value)}
        />
      </div>
      <div>
        <Button id="recover-password-btn" className="mr2" onClick={onClick}>
          Recover password
        </Button>
        {children}
      </div>
    </div>
  )
}

RecoverPassword.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  children: PropTypes.object,
}

RecoverPassword.defaultProps = {
  onClick: () => { },
  onChange: () => { },
}

export default RecoverPassword
