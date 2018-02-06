import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import SubscriptionListItem from 'components/SubscriptionListItem'

import ShowSubscriptionContainer from 'containers/ShowSubscriptionContainer'

class SubscriptionsList extends Component {
  constructor() {
    super()

    this.handleSubscriptionClick = this.handleSubscriptionClick.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)

    this.state = {
      selected: null,
    }
  }

  handleSubscriptionClick(subscription) {
    this.setState(() => ({ selected: subscription }))
  }

  handleModalClose() {
    this.setState(() => ({ selected: null }))
  }

  render() {
    const { subscriptions, current, withHeader } = this.props
    const { selected } = this.state

    if (subscriptions.size === 0) { return null }

    const renderSubscriptionItem = (subscription, index) => (
      <SubscriptionListItem
        key={subscription.id}
        subscription={subscription}
        current={current}
        last={index === subscriptions.size - 1}
        onClick={this.handleSubscriptionClick}
      />
    )

    return (
      <div
        className="SubscriptionList"
      >
        {selected &&
          <ShowSubscriptionContainer
            subscription={selected}
            onModalClose={this.handleModalClose}
          />}
        <div>
          {withHeader &&
            <div>
              <div className="header flex">
                <div className="w-40 moon-gray">Payment</div>
                <div className="w-20 moon-gray tc">Cycle</div>
                <div className="w-20 moon-gray tc">
                  {current ? 'Bill date' : 'Next bill date'}
                </div>
                <div className="w-10 moon-gray tc">Type</div>
                <div className="w-10 moon-gray tr">Amount</div>
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
