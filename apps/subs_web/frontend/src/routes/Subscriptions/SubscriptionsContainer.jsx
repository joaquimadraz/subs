import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map, OrderedSet } from 'immutable'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import RemoteCall from 'data/domain/RemoteCall'
import getAllSubscriptionsAction from 'data/domain/subscriptions/getAllSubscriptions/action'
import Subscriptions from './Subscriptions'

class SubscriptionsContainer extends Component {
  componentDidMount() {
    const { dispatch } = this.props

    dispatch(getAllSubscriptionsAction())
  }

  render() {
    const {
      subscriptions,
      currentUser,
      avgs,
      remoteCall,
      children,
    } = this.props

    return (
      <div>
        {children}
        <Subscriptions
          currentUser={currentUser}
          avgs={avgs}
          subscriptions={subscriptions}
          remoteCall={remoteCall}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { subscriptions, currentUser } = state

  const subscriptionsRecords = subscriptions.get('ids').map(id => (
    subscriptions.getIn(['entities', id])
  ))

  return {
    currentUser,
    avgs: subscriptions.get('avgs'),
    subscriptions: subscriptionsRecords,
    remoteCall: subscriptions.get('remoteCall'),
  }
}

SubscriptionsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  avgs: PropTypes.instanceOf(Map).isRequired,
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
  remoteCall: PropTypes.instanceOf(RemoteCall).isRequired,
}

export default connect(mapStateToProps)(SubscriptionsContainer)
