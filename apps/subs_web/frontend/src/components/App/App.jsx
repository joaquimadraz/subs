import React from 'react'
import PropTypes from 'prop-types'
import LoadingBar from 'react-redux-loading-bar'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import PrivateApp from './PrivateApp'
import PublicApp from './PublicApp'
import Styles from './Styles'

const App = ({ currentUser, onLogoutClick, children }) => (
  <Styles className="f6">
    <LoadingBar style={{ backgroundColor: '#BC274E', height: 4 }} />

    {currentUser.isLogged
      ? (
        <PrivateApp
          currentUser={currentUser}
          onLogoutClick={onLogoutClick}
        >
          {children}
        </PrivateApp>
      )
      : <PublicApp>{children}</PublicApp>
      }
  </Styles>
)

App.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}

export default App
