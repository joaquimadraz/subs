import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from './Styles'

class ToolTip extends Component {
  constructor() {
    super()

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)

    this.state = { visible: false }
  }

  handleMouseEnter() {
    this.setState({ visible: true })
  }

  handleMouseLeave() {
    this.setState({ visible: false })
  }

  render() {
    const { visible } = this.state
    const { children, text, className } = this.props

    return (
      <Styles
        className="relative"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          className={classNames('Tooltip--text', { dn: !visible })}
        >
          <div>{text}</div>
          <div className="Tooltip--arrow" />
        </div>
        <div className={className} title={text}>
          {children}
        </div>
      </Styles>
    )
  }
}

ToolTip.propTypes = {
  children: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}

export default ToolTip
