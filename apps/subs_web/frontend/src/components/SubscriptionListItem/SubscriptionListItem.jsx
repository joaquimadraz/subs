import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'

import routes from 'constants/routes'
import colors from 'constants/colors'
import Subscription from 'data/domain/subscriptions/Subscription'
import Styles from './Styles'

const SubscriptionListItem = ({ subscription, current, last }) => {
  const isDue = current && subscription.isCurrentDue
  const cx = classNames('SubscriptionListItem br2', { mb2: !last })

  return (
    <Styles
      className={cx}
      background={isDue ? colors.disabled.bg : subscription.color}
      textColor={isDue ? colors.disabled.text : subscription.textColor}
    >
      <Link
        to={routes.subscriptionsShow(subscription.id)}
        className="flex items-center dim pointer no-underline"
        title={subscription.name}
      >
        <div className="w-30 w-40-l pa3">
          <span className="SubscriptionListItem--name">
            {subscription.name}
          </span>
        </div>
        <div className="w-20 pa3 tc">
          {subscription.cycle}
        </div>
        <div className="w-20 pa3 tc">
          <span className="SubscriptionListItem--next-bill-date">
            {current ? subscription.humanCurrentBillDate : subscription.humanNextBillDate}
          </span>
        </div>
        <div className="w-30 w-20-l pa3 tr">
          <span className="SubscriptionListItem--type--description">
            Credit Card
          </span>
        </div>
        <div className="w-30 w-20-l pa3 tr">
          <span className="SubscriptionListItem--amount">
            {subscription.amountFormatted}
          </span>
        </div>
      </Link>
    </Styles>
  )
}

SubscriptionListItem.propTypes = {
  subscription: PropTypes.instanceOf(Subscription).isRequired,
  current: PropTypes.bool,
  last: PropTypes.bool,
}

SubscriptionListItem.defaultProps = {
  current: false,
  last: false,
}

export default SubscriptionListItem
