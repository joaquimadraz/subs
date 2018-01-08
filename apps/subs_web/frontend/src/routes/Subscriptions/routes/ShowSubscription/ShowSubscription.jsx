import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'

import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'

import Button from 'components/Button'
import SubscriptionForm from 'components/SubscriptionForm'

const ShowSubscription = ({
  data,
  subscription,
  services,
  onClick,
  onChange,
  onArchiveClick,
  remoteCall,
}) => {
  if (!subscription) {
    return (<p>Loading...</p>)
  }

  const handleArchiveClick = (event) => {
    event.preventDefault()

    onArchiveClick(subscription.id)
  }

  return (
    <div>
      <div className="flex">
        <div className="w-50-l w-80-m center">
          <h1>{subscription.name}</h1>
          <SubscriptionForm
            onClick={onClick}
            onChange={onChange}
            remoteCall={remoteCall}
            subscription={data}
            services={services}
          >
            <Button
              className="SubscriptionListItem--archive-button"
              onClick={handleArchiveClick}
              color="red"
            >
              Archive
            </Button>
          </SubscriptionForm>
        </div>
        {/* <div className="w-60 pa3">
          <div className="f5 b dark-gray mt0 mb2">Payments</div>
          <ul className="pl0 mt0 light-silver">
            <li className="flex justify-around lh-copy mb2">
              <div className="w-20">12/08/2017</div>
              <div className="w-60 tc" />
              <div className="w-20 tr">7.99£</div>
            </li>
            <li className="flex justify-around lh-copy mb2">
              <div className="w-20">12/08/2017</div>
              <div className="w-60 tc" />
              <div className="w-20 tr">7.99£</div>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  )
}

ShowSubscription.propTypes = {
  data: PropTypes.instanceOf(Subscription),
  subscription: PropTypes.instanceOf(Subscription),
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onArchiveClick: PropTypes.func,
  remoteCall: PropTypes.instanceOf(RemoteCall),
  services: PropTypes.instanceOf(OrderedSet),
}

export default ShowSubscription
