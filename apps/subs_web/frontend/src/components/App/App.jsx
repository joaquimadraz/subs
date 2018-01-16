import React from 'react'
import PropTypes from 'prop-types'
import LoadingBar from 'react-redux-loading-bar'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt'
// import faCog from '@fortawesome/fontawesome-free-solid/faCog'
// import faUserCircle from '@fortawesome/fontawesome-free-solid/faUserCircle'
import CurrentUser from 'data/domain/currentUser/CurrentUser'

import Styles from './Styles'
import Navigation from './Navigation'

const App = ({ currentUser, onLogoutClick, children }) => {
  return (
    <Styles className="f6">
      <LoadingBar style={{ backgroundColor: '#BC274E', height: 4 }} />

      <div className="flex">
        <div style={{ background: '#212943' }} className="vh-100 fixed w-20 z-2">
          <Navigation currentUser={currentUser} />
        </div>
        <div className="App--content w-80">
          <div className="fixed w-80 h3 pv3 ph4 flex z-2">
            <div className="w-60 silver lh-copy">
              <FontAwesomeIcon icon={faBell} className="blue mr2 f4 v-mid" />
              <span className="v-mid">You have <span className="blue b">1 yearly payment</span> this month</span>
            </div>
            <div className="w-40">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="silver f4 fr mt1"
                onClick={onLogoutClick}
              />
              {/* <FontAwesomeIcon icon={faUserCircle} className="silver f4 fr" onClick={onLogoutClick} /> */}
              {/* <FontAwesomeIcon icon={faCog} className="silver f4 fr mr4" /> */}
            </div>
          </div>
          <div className="pa4 mt5">
            {children}
          </div>
        </div>
      </div>
      <div className="App-top-bar fixed h3 bg-white bb absolute left-0 top-0 w-100 z-1" />
    </Styles>
  )
}

App.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}

export default App
