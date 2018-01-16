import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CurrentUser from 'data/domain/currentUser/CurrentUser'

const MonthDiff = ({ currentUser, currentTotal, previousTotal }) => {
  const diff = currentTotal - previousTotal

  if (diff === 0) { return null }

  const isPositive = diff < 0

  const containerCx = classNames('f5 v-mid ml2 b', {
    red: !isPositive,
    green: isPositive,
  })

  const arrowCx = classNames('dib v-mid', {
    'b--red Home--arrow-up': !isPositive,
    'b--green Home--arrow-down': isPositive,
  })

  const sign = isPositive ? '-' : '+'

  const value = Math.abs(diff).toFixed(2)

  return (
    <small className={containerCx}>
      <span className={arrowCx} />
      <span className="dib ml2 v-mid">{sign} {currentUser.currencySymbol}{value}</span>
    </small>
  )
}

MonthDiff.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  currentTotal: PropTypes.number.isRequired,
  previousTotal: PropTypes.number.isRequired,
}

export default MonthDiff
