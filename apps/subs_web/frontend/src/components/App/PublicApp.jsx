import React from 'react'
import PropTypes from 'prop-types'

const PublicApp = ({ children }) => {
  return (
    <div className="vh-100 dt w-100" style={{ background: '#212943' }}>
      <div className="dtc v-mid ph3 ph4-l">
        {children}
      </div>
    </div>
  )
}

PublicApp.propTypes = {
  children: PropTypes.object.isRequired,
}

export default PublicApp
