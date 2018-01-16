import React from 'react'
import PropTypes from 'prop-types'

import CenteredContainer from 'components/CenteredContainer'

const PublicApp = ({ children }) => {
  return (
    <CenteredContainer>
      <div className="b i f1 white tc mb4">OpenSubs</div>
      {children}
    </CenteredContainer>
  )
}

PublicApp.propTypes = {
  children: PropTypes.object.isRequired,
}

export default PublicApp
