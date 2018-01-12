import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Message = ({ children, success, error }) => {
  const cx = classNames('pa2 f6 ba br2 bw1 mb3', {
    'b--green bg-light-green dark-green': success,
    'b--red bg-light-red white': error,
    'b--gray bg-light-gray gray': (!success && !error),
  })

  return (
    <div className={cx}>
      <p className="pa1 ma0 message">{children}</p>
    </div>
  )
}

Message.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  success: PropTypes.bool,
  error: PropTypes.bool,
}

Message.defaultProps = {
  success: false,
  error: false,
}

export default Message
