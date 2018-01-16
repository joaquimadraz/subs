import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import routes from 'constants/routes'
import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import getSubscriptionAction from 'data/domain/subscriptions/getSubscription/action'
import updateSubscriptionAction from 'data/domain/subscriptions/updateSubscription/action'
import archiveSubscriptionAction from 'data/domain/subscriptions/archiveSubscription/action'
import Modal from 'components/Modal'
import ShowSubscription from './ShowSubscription'

class ShowsSubscriptionContainer extends Component {
  constructor() {
    super()

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleArchiveClick = this.handleArchiveClick.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)

    this.state = {
      data: new Subscription(),
    }
  }

  componentDidMount() {
    const { dispatch, params: { subscriptionId } } = this.props

    dispatch(getSubscriptionAction(subscriptionId))
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.state

    if (!data || !data.id) {
      this.setState(() => ({ data: nextProps.subscription }))
    }
  }

  handleFormSubmit() {
    const { dispatch, params: { subscriptionId } } = this.props
    const data = this.state.data.toMap()

    dispatch(updateSubscriptionAction(subscriptionId, { subscription: data }))
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

  handleModalClose() {
    this.props.router.goBack()
  }

  render() {
    const { remoteCall, subscription } = this.props
    const { data } = this.state

    return (
      <Modal onClose={this.handleModalClose}>
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

const mapStateToProps = (state, props) => {
  const { services, subscriptions } = state
  const { params: { subscriptionId } } = props

  const subscription = subscriptions.getIn(['entities', parseInt(subscriptionId, 10)])

  const servicesRecords = services.get('ids').map(id => (
    services.getIn(['entities', id])
  ))

  return {
    subscription,
    services: servicesRecords,
    remoteCall: state.subscriptions.get('remoteCall'),
  }
}

ShowsSubscriptionContainer.propTypes = {
  params: PropTypes.object,
  router: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall),
  subscription: PropTypes.instanceOf(Subscription),
}

export default connect(mapStateToProps)(ShowsSubscriptionContainer)
