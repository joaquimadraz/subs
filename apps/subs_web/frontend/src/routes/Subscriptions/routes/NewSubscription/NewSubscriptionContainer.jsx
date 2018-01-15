import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { OrderedSet } from 'immutable'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import createSubscriptionAction from 'data/domain/subscriptions/createSubscription/action'
import getAllServicesAction from 'data/domain/services/getAllServices/action'
import NewSubscription from './NewSubscription'

class NewSubscriptionContainer extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)

    const data = new Subscription({
      amount_currency: props.currentUser.currency,
      amount_currency_symbol: props.currentUser.currencySymbol,
    })

    this.state = { data }
  }

  componentDidMount() {
    const { dispatch, services } = this.props

    if (services.size === 0) {
      dispatch(getAllServicesAction())
    }
  }

  handleFormSubmit() {
    const { dispatch } = this.props
    let data = this.state.data.toMap()

    if (!data.get('service_code')) {
      data = data.delete('service_code')
    }

    dispatch(createSubscriptionAction({ subscription: data }))
  }

  handleFormChange(attribute, value) {
    this.setState((prevState) => {
      const data = prevState.data.set(attribute, value)
      return { ...prevState, data }
    })
  }

  render() {
    const { subscription, services, remoteCall } = this.props
    const { data } = this.state
    const newSubscription = subscription || data

    return (
      <NewSubscription
        services={services}
        subscription={newSubscription}
        remoteCall={remoteCall}
        onClick={this.handleFormSubmit}
        onChange={this.handleFormChange}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const { services, subscriptions, currentUser } = state

  const subscription = subscriptions.getIn(['entities', 'new'])

  const servicesRecords = services.get('ids').map(id => (
    services.getIn(['entities', id])
  ))

  return {
    currentUser,
    subscription,
    services: servicesRecords,
    remoteCall: state.subscriptions.get('remoteCall'),
  }
}

NewSubscriptionContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  services: PropTypes.instanceOf(OrderedSet).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  subscription: PropTypes.instanceOf(Subscription),
}

export default connect(mapStateToProps)(NewSubscriptionContainer)
