import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import { formatDate } from 'utils/dt'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import Styles from './Styles'
import MonthDiff from './MonthDiff'

const CurrentMonthStats = ({ currentUser, currentDate, month, prevMonth }) => (
  <Styles>
    <div className="flex ph2">
      <div className="flex-auto">
        <div className="moon-gray">
          <div className="CurrentMonthStats--year">{formatDate(currentDate, 'YYYY')}</div>
          <h3 className="CurrentMonthStats--month f3 ma0 ttu mt1 subs-blue-darker">
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
          <span className="CurrentMonthStats--total f3 ma0 ttu mt1 v-mid ml3 b subs-blue-darker">
            {currentUser.currencySymbol}{month.get('total')}
          </span>
        </div>
      </div>
    </div>
  </Styles>
)

CurrentMonthStats.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  currentDate: PropTypes.object.isRequired,
  month: PropTypes.instanceOf(Map).isRequired,
  prevMonth: PropTypes.instanceOf(Map).isRequired,
}

export default CurrentMonthStats
