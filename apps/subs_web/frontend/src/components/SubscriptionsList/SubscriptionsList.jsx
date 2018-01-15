import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import SubscriptionListItem from 'components/SubscriptionListItem'
import routes from 'constants/routes'

const renderNoPayments = () => (
  <p className="b silver tc">
    <span>You have no payments. Click </span>
    <Link to={routes.subscriptionsNew} className="subs-blue">here</Link>
    <span> to add one.</span>
  </p>
)

const SubscriptionsList = ({ subscriptions, current }) => {
  const renderSubscriptionItem = subscription => (
    <SubscriptionListItem
      key={subscription.id}
      subscription={subscription}
      current={current}
    />
  )

  const renderSubscriptionsList = () => (
    <div>
      <div className="flex">
        <div className="w-30 w-40-l moon-gray">Payment</div>
        <div className="w-20 moon-gray tc">Cycle</div>
        <div className="w-20 moon-gray tc">
          {current ? 'Bill date' : 'Next bill date'}
        </div>
        <div className="w-30 w-20-l moon-gray tr">Amount</div>
      </div>
      <div className="mv3 bb b--near-white" />
      <ul className="pl0 ma0">
        {subscriptions.map(renderSubscriptionItem)}
      </ul>
    </div>
  )

  return (
    <div
      className="SubscriptionList mb2 list"
    >
      {subscriptions.size === 0
        ? renderNoPayments()
        : renderSubscriptionsList()}
    </div>
  )
}

SubscriptionsList.propTypes = {
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
  current: PropTypes.bool.isRequired,
}

SubscriptionsList.defaultProps = {
  current: false,
}

export default SubscriptionsList
