import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'

import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'

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

  return (
    <div className="w-50-l w-80-m center">
      <SubscriptionForm
        onClick={onClick}
        onChange={onChange}
        remoteCall={remoteCall}
        subscription={subscription}
        services={services}
      />
    </div>
  )
}

NewSubscription.propTypes = {
  subscription: PropTypes.instanceOf(Subscription),
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  remoteCall: PropTypes.instanceOf(RemoteCall),
  services: PropTypes.instanceOf(OrderedSet),
}

export default NewSubscription
