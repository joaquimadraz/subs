import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Map, OrderedSet } from 'immutable'

import routes from 'constants/routes'
import CurrentUser from 'data/domain/currentUser/CurrentUser'
import SubscriptionsList from 'components/SubscriptionsList'
import NoSubscriptions from 'components/NoSubscriptions'

const Subscriptions = ({
  currentUser,
  avgs,
  subscriptions,
  isLoading,
}) => {
  if (isLoading) {
    return (<p>Loading...</p>)
  }

  return (
    <div>
      <div className="flex ph2">
        <div className="flex-column">
          <div className="moon-gray">
            <div>{subscriptions.size} payment{subscriptions.size === 1 ? '' : 's'}</div>
            <h3 className="f3 ma0 ttu mt1 subs-blue-darker">All Payments</h3>
          </div>
        </div>
        <div className="flex-column ml4">
          <div className="moon-gray">
            <div className="fl mr4">
              <div>Avg. per month</div>
              <div className="Subscriptions--monthly-avg f3 ma0 ttu mt1 b subs-blue-darker">
                {currentUser.currencySymbol}{avgs.get('monthly')}
              </div>
            </div>
            <div className="fl">
              <div>Avg. per year</div>
              <div className="Subscriptions--yearly-avg f3 ma0 ttu mt1 b subs-blue-darker">
                {currentUser.currencySymbol}{avgs.get('yearly')}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-auto">
          <div>&nbsp;</div>
          <div className="mt2 fr">
            <Link to={routes.subscriptionsNew} className="bg-subs-blue no-underline bn white pv2 ph3 br2 pointer dim">
              New payment
            </Link>
          </div>
        </div>
      </div>
      <div className="br2 bg-white mt4 ba ph4 pv4 b--moon-gray">
        {
          subscriptions.size === 0
            ? <NoSubscriptions />
            : <SubscriptionsList subscriptions={subscriptions} />
        }
      </div>
    </div>
  )
}

Subscriptions.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  avgs: PropTypes.instanceOf(Map).isRequired,
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
  isLoading: PropTypes.bool,
}

Subscriptions.defaultProps = {
  isLoading: false,
}

export default Subscriptions
