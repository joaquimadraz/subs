import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import { formatDate } from 'utils/dt'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import SubscriptionPill from 'components/SubscriptionPill'
import Styles from './Styles'
import MonthDiff from './MonthDiff'

const renderYearlySubscriptions = (subscriptions) => {
  const yearlyPayments = subscriptions.filter(sub => sub.cycle === 'yearly')

  const noYearlyPayments = (
    <div>
      <p className="gray f6">No yearly payments this month.</p>
    </div>
  )

  return (
    <div className="flex-auto">
      <div className="f6 b light-silver">
        <span className="subs-pink">Yearly payments</span>
        <small className="ml2">this month</small>
      </div>
      <div className="flex mt2">
        {yearlyPayments.size === 0
          ? noYearlyPayments
          : yearlyPayments.map((subscription, index) => (
            <SubscriptionPill
              key={subscription.id}
              subscription={subscription}
              last={index !== subscriptions.length}
            />
          ))}
      </div>
    </div>
  )
}

const CurrentMonthStats = ({ currentUser, currentDate, month, prevMonth }) => (
  <Styles>
    <div className="flex ph2">
      <div className="flex-auto">
        <div className="moon-gray">
          <div>{formatDate(currentDate, 'YYYY')}</div>
          <h3 className="f3 ma0 ttu mt1" style={{ color: '#1A173B' }}>
            {formatDate(currentDate, 'MMMM')}
          </h3>
        </div>
      </div>
      <div className="flex-auto">
        <div className="moon-gray tr">
          <div>Total</div>
          <MonthDiff
            currentUser={currentUser}
            currentTotal={month.get('total')}
            previousTotal={prevMonth.get('total')}
          />
          <span className="f3 ma0 ttu mt1 v-mid ml3 b" style={{ color: '#1A173B' }}>
            {currentUser.currencySymbol}{month.get('total')}
          </span>
        </div>
      </div>
    </div>
    {/* <div className="flex-auto">
      {renderYearlySubscriptions(month.get('subscriptions'))}
    </div> */}
  </Styles>
)

CurrentMonthStats.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  currentDate: PropTypes.object.isRequired,
  month: PropTypes.instanceOf(Map).isRequired,
  prevMonth: PropTypes.instanceOf(Map).isRequired,
}

export default CurrentMonthStats
