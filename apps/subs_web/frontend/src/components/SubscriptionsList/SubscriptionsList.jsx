import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import SubscriptionListItem from 'components/SubscriptionListItem'

const SubscriptionsList = ({ subscriptions, current, withHeader }) => {
  if (subscriptions.size === 0) { return null }

  const renderSubscriptionItem = (subscription, index) => (
    <SubscriptionListItem
      key={subscription.id}
      subscription={subscription}
      current={current}
      last={index === subscriptions.size - 1}
    />
  )

  return (
    <div
      className="SubscriptionList"
    >
      <div>
        {withHeader &&
          <div>
            <div className="header flex">
              <div className="w-30 w-40-l moon-gray">Payment</div>
              <div className="w-20 moon-gray tc">Cycle</div>
              <div className="w-20 moon-gray tc">
                {current ? 'Bill date' : 'Next bill date'}
              </div>
              <div className="w-30 w-20-l moon-gray tr">Amount</div>
            </div>
            <div className="mv3 bb b--near-white" />
          </div>
        }
        <ul className="pl0 ma0 list">
          {subscriptions.toIndexedSeq().map(renderSubscriptionItem)}
        </ul>
      </div>
    </div>
  )
}

SubscriptionsList.propTypes = {
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
  current: PropTypes.bool,
  withHeader: PropTypes.bool,
}

SubscriptionsList.defaultProps = {
  current: false,
  withHeader: true,
}

export default SubscriptionsList
