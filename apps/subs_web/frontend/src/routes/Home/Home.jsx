import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'

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
    onNextMonthClick,
    isLoading,
  } = props

  if (isLoading) {
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
        <div className="br2 bg-white mt4 ba pa4 b--moon-gray">
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
  onNextMonthClick: PropTypes.func,
  isLoading: PropTypes.bool,
}

Home.defaultProps = {
  isLoading: false,
}

export default Home
