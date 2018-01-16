import React from 'react'
import PropTypes from 'prop-types'

const CenteredContainer = ({ children }) => {
  return (
    <div className="vh-100 dt w-100 bg-subs-blue-darker">
      <div className="dtc v-mid ph3 ph4-l">
        {children}
      </div>
    </div>
  )
}

CenteredContainer.propTypes = {
  children: PropTypes.object.isRequired,
}

export default CenteredContainer
