import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Styles from './Styles'

const colorClass = color => `bg-${color}`

// TODO: Deconstruct props to <button>
const Button = (props) => {
  const {
    children,
    color,
    className,
    ...buttonProps
  } = props

  const classNames = cx(
    className,
    colorClass(color),
    'bn white pv2 ph3 br2 pointer dim',
  )

  return (
    <Styles
      className={classNames}
      {...buttonProps}
    >
      {children}
    </Styles>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
  color: PropTypes.string,
}

Button.defaultProps = {
  onClick: () => {},
  color: 'subs-blue',
}

export default Button
