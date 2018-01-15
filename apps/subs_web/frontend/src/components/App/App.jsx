import React from 'react'
import PropTypes from 'prop-types'
import LoadingBar from 'react-redux-loading-bar'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faBell from '@fortawesome/fontawesome-free-solid/faBell'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'
import faUserCircle from '@fortawesome/fontawesome-free-solid/faUserCircle'
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
                <button className="bg-blue button bn white pa2 br2 fr mr4">New payment</button>
              </div>
            </div>
            <div className="pa4">
              {children}
              {/* <div className="moon-gray">
                <div>2018</div>
                <h3 className="f3 ma0 ttu" style={{ color: '#1A173B' }}>January</h3>
              </div>
              <div className="br2 bg-white mt3 ba pa3" style={{ color: '#EBEDF8' }}>Payment</div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="App--sidebar vh-100 w-20 fixed left-0 top-0" />
      <div className="App-top-bar h3 bg-white bb fixed left-0 top-0 w-100" />
    </Styles>
  )
}

App.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
}

export default App
