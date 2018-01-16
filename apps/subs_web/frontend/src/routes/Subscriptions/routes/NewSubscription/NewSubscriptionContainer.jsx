import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { OrderedSet } from 'immutable'

import routes from 'constants/routes'
import CurrentUser from 'data/domain/currentUser/CurrentUser'
import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import createSubscriptionAction, { CREATE_SUBSCRIPTION_RESET } from 'data/domain/subscriptions/createSubscription/action'
import getAllServicesAction from 'data/domain/services/getAllServices/action'
import Modal from 'components/Modal'
import NewSubscription from './NewSubscription'

class NewSubscriptionContainer extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)

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

  componentWillUnmount() {
    this.props.dispatch({ type: CREATE_SUBSCRIPTION_RESET })
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

  handleModalClose() {
    this.props.router.goBack()
  }

  render() {
    const { subscription, services, remoteCall } = this.props
    const { data } = this.state
    const newSubscription = subscription || data

    return (
      <Modal onClose={this.handleModalClose}>
        <NewSubscription
          services={services}
          subscription={newSubscription}
          onClick={this.handleFormSubmit}
          onChange={this.handleFormChange}
          remoteCall={remoteCall}
        />
      </Modal>
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
  router: PropTypes.object.isRequired,
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  services: PropTypes.instanceOf(OrderedSet).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
  subscription: PropTypes.instanceOf(Subscription),
}

export default connect(mapStateToProps)(NewSubscriptionContainer)
