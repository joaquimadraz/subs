import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Message = ({ color, children }) => {
  const borderColorClass = `b--${color}`
  const bgColorClass = `bg-light-${color}`
  const cx = classNames('pa2 f6 ba br2 bw1 mb3', bgColorClass, borderColorClass)

  return (
    <div className={cx}>
      <div className="pa1 white message">
        {children}
      </div>
    </div>
  )
}

Message.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  color: PropTypes.string,
}

Message.defaultProps = {
  color: 'gray',
}

export default Message
