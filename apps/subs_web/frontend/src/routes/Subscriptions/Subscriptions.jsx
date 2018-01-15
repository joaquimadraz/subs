import React from 'react'
import PropTypes from 'prop-types'
import { Map, OrderedSet } from 'immutable'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import RemoteCall from 'data/domain/RemoteCall'
import SubscriptionsList from 'components/SubscriptionsList'

const Subscriptions = ({
  currentUser,
  avgs,
  subscriptions,
  remoteCall,
}) => {
  if (remoteCall.loading) {
    return (<p>Loading...</p>)
  }
  return (
    <div>
      <div className="flex ph2">
        <div className="flex-auto">
          <div className="moon-gray">
            <div>{subscriptions.size} payment{subscriptions.size === 1 ? '' : 's'}</div>
            <h3 className="f3 ma0 ttu mt1" style={{ color: '#1A173B' }}>
              All Payments
            </h3>
          </div>
        </div>
        <div className="flex-auto">
          <div className="tr moon-gray">
            <div className="fr ml3">
              <div>Avg. per year</div>
              <div className="f3 ma0 ttu mt1 ml4 b" style={{ color: '#1A173B' }}>
                {currentUser.currencySymbol}{avgs.get('yearly')}
              </div>
            </div>
            <div className="fr">
              <div>Avg. per month</div>
              <div className="f3 ma0 ttu mt1 ml3 b" style={{ color: '#1A173B' }}>
                {currentUser.currencySymbol}{avgs.get('monthly')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="br2 bg-white mt3-5 ba ph3-5 pv3 b--moon-gray">
        <SubscriptionsList subscriptions={subscriptions} />
      </div>
    </div>
  )
}

Subscriptions.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  avgs: PropTypes.instanceOf(Map).isRequired,
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
}

export default Subscriptions


