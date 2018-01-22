import React from 'react'
import PropTypes from 'prop-types'
import { Map, OrderedSet } from 'immutable'
import classNames from 'classnames'

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

  const subscriptions = month.get('subscriptions').reduce((acc, subscription) => {
    if (subscription.isCurrentDue) {
      return acc.update('due', set => set.add(subscription))
    }

    return acc.update('next', set => set.add(subscription))
  }, Map({ next: OrderedSet(), due: OrderedSet() }))

  const renderLoggedPage = () => {
    return (
      <div>
        <CurrentMonthStats
          currentUser={currentUser}
          currentDate={currentDate}
          month={month}
          prevMonth={prevMonth}
        />
        {(subscriptions.get('next').size > 0 || month.get('subscriptions').size === 0) &&
          <div className="NextSubscriptions br2 bg-white mt4 ba pa4 b--moon-gray">
            <SubscriptionsList
              subscriptions={subscriptions.get('next')}
              current
            />
          </div>
        }

        {subscriptions.get('next').size > 0 && subscriptions.get('due').size > 0 &&
          <div>
            <span className="w-40 mv4 bb b--moon-gray o-20 v-mid dib" />
            <span className="w-20 dib tc moon-gray">Due</span>
            <span className="w-40 mv4 bb b--moon-gray o-20 v-mid dib" />
          </div>
        }

        {subscriptions.get('due').size > 0 &&
          <div className={classNames('DueSubscriptions br2 bg-white ba pa4 b--moon-gray', { mt4: subscriptions.get('next').size === 0 })}>
            <SubscriptionsList
              subscriptions={subscriptions.get('due')}
              withHeader={subscriptions.get('next').size === 0}
              current
            />
          </div>
        }
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
