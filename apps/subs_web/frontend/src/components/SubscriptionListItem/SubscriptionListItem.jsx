import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCreditCard from '@fortawesome/fontawesome-free-solid/faCreditCard'
import faUniversity from '@fortawesome/fontawesome-free-solid/faUniversity'
import faInfo from '@fortawesome/fontawesome-free-solid/faInfo'

import routes from 'constants/routes'
import colors from 'constants/colors'
import { CARD, DIRECT_DEBIT, OTHER } from 'constants/paymentTypes'
import Tooltip from 'components/Tooltip'

import Subscription from 'data/domain/subscriptions/Subscription'
import Styles from './Styles'

const findPaymentTypeIcon = (type) => {
  switch (type) {
    case CARD:
      return <FontAwesomeIcon icon={faCreditCard} />
    case DIRECT_DEBIT:
      return <FontAwesomeIcon icon={faUniversity} />
    case OTHER:
      return <FontAwesomeIcon icon={faInfo} />
    default:
      return null
  }
}

const renderPaymentType = (subscription) => {
  if (!subscription.type) { return null }

  return (
    <Tooltip
      className="SubscriptionListItem--type-description"
      text={subscription.type_description}
    >
      <span className="pa1">{findPaymentTypeIcon(subscription.type)}</span>
    </Tooltip>
  )
}

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
        className="flex items-center pointer no-underline"
        title={subscription.name}
      >
        <div className="w-40 pa3">
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
        <div className="w-10 pa3 tc">
          {renderPaymentType(subscription)}
        </div>
        <div className="w-10 pa3 tr">
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
