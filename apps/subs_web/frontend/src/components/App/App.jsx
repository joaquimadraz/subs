import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'
import faUserCircle from '@fortawesome/fontawesome-free-solid/faUserCircle'
import routes from 'constants/routes'
import CurrentUser from 'data/domain/currentUser/CurrentUser'

import Styles from './Styles'
import Navigation from './Navigation'

const App = ({ currentUser, onLogoutClick, children }) => {
  return (
    <Styles className="f6">
      <LoadingBar style={{ backgroundColor: '#BC274E', height: 4 }} />

      <div className="mw8-ns center">
        <div className="flex">
          <div style={{ background: '#212943' }} className="vh-100 w-20">
            <Navigation currentUser={currentUser} />
          </div>
          <div className="w-80">
            <div className="h3 pa3 flex">
              <div className="w-60 silver">
                <FontAwesomeIcon icon={faBell} className="blue mr2 f4" />
                <span>You have <span className="blue b">1 yearly payment</span> this month</span>
              </div>
              <div className="w-40">
                <FontAwesomeIcon icon={faUserCircle} className="silver f4 fr" onClick={onLogoutClick} />
                <FontAwesomeIcon icon={faCog} className="silver f4 fr mr4" />
                <Link to={routes.subscriptionsNew} className="bg-subs-blue no-underline bn white pv2 ph3 br2 pointer dim">
                  New payment
                </Link>
              </div>
            </div>
            <div className="pa3-5">
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="App--sidebar vh-100 w-20 absolute left-0 top-0" />
      <div className="App-top-bar h3 bg-white bb absolute left-0 top-0 w-100" />
    </Styles>
  )
}

App.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}

export default App
