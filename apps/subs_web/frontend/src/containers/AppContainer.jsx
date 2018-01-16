import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import { connect } from 'react-redux'
import LoadingBar from 'react-redux-loading-bar'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import logoutAction from 'data/domain/currentUser/logout/action'
import getCurrentUserAction from 'data/domain/currentUser/getCurrentUser/action'

import PrivateApp from 'components/App/PrivateApp'
import PublicApp from 'components/App/PublicApp'
import Styles from 'components/App/Styles'

class AppContainer extends Component {
  constructor() {
    super()

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(getCurrentUserAction())
  }

  handleLogoutClick() {
    const { dispatch } = this.props

    dispatch(logoutAction())
  }

  render() {
    const { currentUser, subscriptions, children } = this.props

    // TODO: Extract to component
    if (!currentUser.wasRequested) {
      return (
        <div className="vh-100 dt w-100 bg-subs-blue-darker">
          <div className="dtc v-mid ph3 ph4-l tc white">
            <p>Booting the systems...</p>
          </div>
        </div>
      )
    }

    return (
      <Styles className="f6">
        <LoadingBar style={{ backgroundColor: '#0077FF', height: 4 }} />

        {currentUser.isLogged
          ? (
            <PrivateApp
              currentUser={currentUser}
              subscriptions={subscriptions}
              onLogoutClick={this.handleLogoutClick}
            >
              {children}
            </PrivateApp>
          )
          : <PublicApp>{children}</PublicApp>
        }
      </Styles>
    )
  }
}

const mapStateToProps = (state) => {
  const { currentUser, subscriptions } = state
  const monthSubscriptions = subscriptions.getIn(['month', 'subscriptions'])

  return {
    currentUser,
    subscriptions: monthSubscriptions,
  }
}

AppContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  subscriptions: PropTypes.instanceOf(OrderedSet).isRequired,
  children: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(AppContainer)
