import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'

import { toMoment, beginningOfDay, endOfMonth } from 'utils/dt'

const filterYearlyPayments = (subscriptions) => {
  const from = beginningOfDay().getTime()
  const to = endOfMonth().getTime()

  return subscriptions.filter((sub) => {
    const ts = toMoment(sub.current_bill_date).toDate().getTime()

    return sub.cycle === 'yearly' && ts >= from && ts < to
  })
}

const Notifications = ({ subscriptions }) => {
  const yearlyPayments = filterYearlyPayments(subscriptions)

  if (yearlyPayments.size === 0) { return null }

  // TODO: Extract pluralization to lib
  const payments = yearlyPayments.size === 1 ? 'payment' : 'payments'

  return (
    <div>
      <FontAwesomeIcon icon={faBell} className="subs-blue mr2 f4 v-mid" />
      <span className="v-mid">
        <span>You have </span>
        <span className="subs-blue b">{yearlyPayments.size} yearly {payments}</span>
        <span> this month</span>
      </span>
    </div>
  )
}

Notifications.propTypes = {
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
}

export default Notifications
