import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link, IndexLink } from 'react-router'

import Styles from './Styles'

const NavigationLink = ({
  to,
  children,
  active,
  className,
  index,
}) => {
  const defaultCx = 'db mv2 mh2 mh4-l no-underline br2 relative tc'
  const cx = classNames(className, defaultCx, { active })

  return (
    <Styles>
      {index
        ? <IndexLink to={to} className={cx} activeClassName="active">{children}</IndexLink>
        : <Link to={to} className={cx} activeClassName="active">{children}</Link>}
    </Styles>
  )
}

NavigationLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.array,
  active: PropTypes.bool,
  index: PropTypes.bool,
  className: PropTypes.string,
}

NavigationLink.defaultProps = {
  to: '',
  children: '',
  active: false,
  index: false,
}

export default NavigationLink
