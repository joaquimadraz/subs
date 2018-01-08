import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import SubscriptionListItem from 'components/SubscriptionListItem'
import routes from 'constants/routes'

const renderNoPayments = () => (
  <p className="b silver tc">
    <span>You have no payments. Click </span>
    <Link to={routes.subscriptionsNew} className="subs-pink">here</Link>
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
      <h3 className="black-70 f5 mb2 mt3">Payments</h3>
      <ul className="pl0 mt0">
        <li className="flex justify-around items-center lh-copy ph0-l light-silver">
          <div className="w-40 w-60-l pa2 f6 b ">Name</div>
          <div className="w-30 w-20-l pa2 f6 b tc">
            {current ? 'Bill date' : 'Next bill date'}
          </div>
          <div className="w-30 w-20-l pa2 f6 b tr">Amount</div>
        </li>
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
