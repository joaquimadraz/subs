import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'

import colors from 'constants/colors'
import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import { CREATE_SUBSCRIPTION } from 'data/domain/subscriptions/createSubscription/action'

import SubscriptionForm from 'components/SubscriptionForm'

const NewSubscription = ({
  subscription,
  services,
  onClick,
  onChange,
  remoteCall,
}) => {
  if (services.size === 0) {
    return (<p>Loading services...</p>)
  }

  const isLoading = remoteCall.isLoading(CREATE_SUBSCRIPTION)
  const textColor = colors.textColorForBg(subscription.color)

  return (
    <div className="bg-white br2">
      <h3
        className="pa3 f3 ma0 ttu mt1 br--top br2"
        style={{ background: subscription.color, color: textColor }}
      >
        New Payment
      </h3>
      <div className="pa3 br--bottom br2">
        {isLoading
          ? <p>Loading...</p>
          : (
            <SubscriptionForm
              onClick={onClick}
              onChange={onChange}
              remoteCall={remoteCall}
              subscription={subscription}
              services={services}
            />
          )}
      </div>
    </div>
  )
}

NewSubscription.propTypes = {
  subscription: PropTypes.instanceOf(Subscription),
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  services: PropTypes.instanceOf(OrderedSet).isRequired,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
}

export default NewSubscription
