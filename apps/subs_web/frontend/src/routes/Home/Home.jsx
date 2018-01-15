import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'

import RemoteCall from 'data/domain/RemoteCall'
import CurrentUser from 'data/domain/currentUser/CurrentUser'
import SubscriptionsList from 'components/SubscriptionsList'
import CurrentMonthStats from './CurrentMonthStats'
import NextMonthStats from './NextMonthStats'
import Styles from './Styles'

const renderLandingPage = () => {
  return <p>Home</p>
}

const Home = (props) => {
  const {
    currentDate,
    currentUser,
    month,
    prevMonth,
    nextMonth,
    remoteCall,
    onNextMonthClick,
  } = props

  if (remoteCall.loading) {
    return (<p>Loading...</p>)
  }

  const renderLoggedPage = () => {
    return (
      <div>
        <CurrentMonthStats
          currentUser={currentUser}
          currentDate={currentDate}
          month={month}
          prevMonth={prevMonth}
        />
        <div className="br2 bg-white mt3-5 ba ph3-5 pv3 b--moon-gray">
          <SubscriptionsList
            subscriptions={month.get('subscriptions')}
            current
          />
        </div>
        <NextMonthStats
          currentUser={currentUser}
          currentDate={currentDate}
          month={month}
          nextMonth={nextMonth}
          onNextMonthClick={onNextMonthClick}
        />
      </div>
    )
  }

  return (
    <Styles>
      {currentUser.isLogged ? renderLoggedPage() : renderLandingPage()}
    </Styles>
  )
}

Home.propTypes = {
  currentDate: PropTypes.object.isRequired,
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  month: PropTypes.instanceOf(Map).isRequired,
  prevMonth: PropTypes.instanceOf(Map).isRequired,
  nextMonth: PropTypes.instanceOf(Map).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  onNextMonthClick: PropTypes.func,
}

export default Home
