import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import routes from 'constants/routes'
import RemoteCall from 'data/domain/RemoteCall'
import Message from 'components/Message'
import ResetPasswordForm from './ResetPasswordForm'

const ResetPassword = ({
  data,
  onClick,
  onChange,
  remoteCall,
  isTokenValid,
  wasTokenChecked,
  wasPasswordUpdated,
}) => {
  if (!wasTokenChecked) {
    return (<p>Checking your token validity...</p>)
  }

  if (wasPasswordUpdated) {
    return (<p>Password was updated. Click <Link to={routes.login} className="link subs-blue b">here</Link> to log in.</p>)
  }

  if (!isTokenValid) {
    return (<p>{remoteCall.message}. Click <Link to={routes.root} className="link subs-blue b">here</Link> to go home.</p>)
  }

  return (
    <ResetPasswordForm
      remoteCall={remoteCall}
      data={data}
      onClick={onClick}
      onChange={onChange}
    />
  )
}

ResetPassword.propTypes = {
  data: PropTypes.object.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  isTokenValid: PropTypes.bool,
  wasTokenChecked: PropTypes.bool,
  wasPasswordUpdated: PropTypes.bool,
}

ResetPassword.defaultProps = {
  onClick: () => { },
  onChange: () => { },
  isTokenValid: false,
  wasTokenChecked: false,
  wasPasswordUpdated: false,
}

export default ResetPassword
