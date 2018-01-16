import React from 'react'
import PropTypes from 'prop-types'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt'
import CurrentUser from 'data/domain/currentUser/CurrentUser'
import Navigation from './Navigation'
import Notifications from './Notifications'

const PrivateApp = ({ currentUser, subscriptions, onLogoutClick, children }) => (
  <div>
    <div className="flex">
      <div className="vh-100 fixed w-20 z-2 bg-subs-blue-darker">
        <Navigation currentUser={currentUser} />
      </div>
      <div className="App--content w-80">
        <div className="fixed w-80 h3 pv3 ph4 flex z-2">
          <div className="w-60 silver lh-copy">
            <Notifications subscriptions={subscriptions} />
          </div>
          <div className="w-40">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="silver f4 fr mt1 dim pointer logout-btn"
              onClick={onLogoutClick}
            />
          </div>
        </div>
        <div className="pa4 mt5">
          {children}
        </div>
      </div>
    </div>
    <div className="App-top-bar fixed h3 bg-white bb absolute left-0 top-0 w-100 z-1" />
  </div>
)

PrivateApp.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}

export default PrivateApp
