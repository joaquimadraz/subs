import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'

import colors from 'constants/colors'
import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import { UPDATE_SUBSCRIPTION } from 'data/domain/subscriptions/updateSubscription/action'

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
  if (!subscription) { return null }

  const handleArchiveClick = (event) => {
    event.preventDefault()

    onArchiveClick(subscription.id)
  }

  const textColor = colors.textColorForBg(data.color)

  return (
    <div className="bg-white br2">
      <h3
        className="pa3 f3 ma0 ttu mt1 br--top br2"
        style={{ background: data.color, color: textColor }}
      >
        {subscription.name}
      </h3>
      <div className="pa3 br--bottom br2">
        {remoteCall.isLoading(UPDATE_SUBSCRIPTION)
          ? <p>Loading...</p>
          : (
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
          )}
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
