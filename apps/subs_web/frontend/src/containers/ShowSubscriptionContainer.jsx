import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import updateSubscriptionAction from 'data/domain/subscriptions/updateSubscription/action'
import archiveSubscriptionAction from 'data/domain/subscriptions/archiveSubscription/action'
import Modal from 'components/Modal'
import ShowSubscription from 'components/ShowSubscription'

class ShowSubscriptionContainer extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleArchiveClick = this.handleArchiveClick.bind(this)

    this.state = {
      data: props.subscription,
    }
  }

  handleFormSubmit() {
    const { dispatch, subscription } = this.props
    const data = this.state.data.toMap()

    dispatch(updateSubscriptionAction(subscription.id, { subscription: data }))
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const data = prevState.data.set(attribute, value)
      return { ...prevState, data }
    })
  }

  handleArchiveClick(subscriptionId) {
    const { dispatch } = this.props

    dispatch(archiveSubscriptionAction(subscriptionId, { archived: true }))
  }

  render() {
    const { remoteCall, subscription, onModalClose } = this.props
    const { data } = this.state

    return (
      <Modal onClose={onModalClose}>
        <ShowSubscription
          data={data}
          subscription={subscription}
          remoteCall={remoteCall}
          onClick={this.handleFormSubmit}
          onChange={this.handleFormChange}
          onArchiveClick={this.handleArchiveClick}
        />
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const { subscriptions } = state

  return {
    remoteCall: subscriptions.get('remoteCall'),
  }
}

ShowSubscriptionContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall),
  subscription: PropTypes.instanceOf(Subscription),
  onModalClose: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(ShowSubscriptionContainer)
