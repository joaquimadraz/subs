import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Map } from 'immutable'
import { formatDateToMonthYear, addMonths } from 'utils/dt'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import Button from 'components/Button'
import Styles from './Styles'

// Example:
// You will be spending 1300£ in January 2018.
// That’s 35 % less than the current month.
const renderMoreLessMessage = (date, nextMonth, diffPerc, currencySymbol) => {
  const precLabel = diffPerc > 0 ? 'more' : 'less'
  const precCx = diffPerc > 0 ? 'red' : 'green'

  return (
    <div>
      <p className="mv2">
        <span>You will be spending </span>
        <span className="subs-blue b">{currencySymbol}{nextMonth.get('total')}</span>
        <span> in {formatDateToMonthYear(date)}.</span>
      </p>
      {diffPerc !== 0 &&
        <p className="mv2">
          <span>That’s </span>
          <span className={classNames(precCx, 'b')}>{Math.abs(diffPerc)}% {precLabel}</span>
          <span> than the current month</span>
        </p>}
    </div>
  )
}

// Example:
// 1 yearly payment is dropping in January 2018.
// The montly expense goes up 20 % than the current month.
const renderYearlyPaymentMessage = (date, count, diffPerc) => {
  const precLabel = diffPerc > 0 ? 'up' : 'down'
  const precCx = diffPerc > 0 ? 'red' : 'green'
  const payments = count === 1 ? 'payment' : 'payments'
  const are = count === 1 ? 'is' : 'are'
  console.log(diffPerc)
  return (
    <div>
      <p className="mv2">
        <span><span className="subs-blue b">{count} yearly {payments}</span> {are} due</span>
        <span> in {formatDateToMonthYear(date)}.</span>
      </p>
      {diffPerc !== 0 &&
        <p className="mv2">
          <span>The monthly expense goes {precLabel} </span>
          <span className={classNames(precCx, 'b')}>{Math.abs(diffPerc)}%</span>
          <span> than the current month.</span>
        </p>}
    </div>
  )
}

const renderBaseMessage = (date, nextMonth, currencySymbol) => {
  return (
    <div>
      <p className="mv2">
        <span>Nothing unexpected is coming, you will be spending <span className="subs-blue b">{currencySymbol}{nextMonth.get('total')}</span></span>
        <span> in {formatDateToMonthYear(date)}.</span>
      </p>
      <p className="mv2">The monthly expense stays pretty much the same.</p>
    </div>
  )
}

const NextMonthStats = ({
  currentUser,
  currentDate,
  month,
  nextMonth,
  onNextMonthClick,
}) => {
  // TODO: Acceptance test + refactor
  const date = addMonths(currentDate, 1)
  const diffPerc = month.get('total') > 0 ? Math.round(((nextMonth.get('total') / month.get('total')) - 1) * 100) : 0
  const yearlyPaymentsCount = nextMonth.get('subscriptions').count(sub => sub.isYearly)

  let message = renderBaseMessage(date, nextMonth, currentUser.currencySymbol)

  if (yearlyPaymentsCount > 0) {
    message = renderYearlyPaymentMessage(date, yearlyPaymentsCount, diffPerc)
  } else if (diffPerc !== 0 || (month.get('total') === 0 && nextMonth.get('total') !== 0)) {
    message = renderMoreLessMessage(date, nextMonth, diffPerc, currentUser.currencySymbol)
  }

  return (
    <Styles>
      <div className="silver tc">
        <div className="mv3">
          {message}
        </div>
        <Button onClick={() => onNextMonthClick(date)}>See more</Button>
      </div>
    </Styles>
  )
}

NextMonthStats.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  currentDate: PropTypes.object.isRequired,
  month: PropTypes.instanceOf(Map).isRequired,
  nextMonth: PropTypes.instanceOf(Map).isRequired,
  onNextMonthClick: PropTypes.func,
}

NextMonthStats.defaultProps = {
  onNextMonthClick: () => {},
}

export default NextMonthStats
