import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import routes from 'constants/routes'
import HeaderLink from 'components/HeaderLink'

import HeaderMenu from './HeaderMenu'
import Styles from './Styles'

const Header = ({ currentUser, onLogoutClick }) => {
  const renderLogged = () => (
    <div>
      <div className="fl w-50">
        <span>
          <HeaderLink to={routes.root} index>
            Up Next
          </HeaderLink>
          <HeaderLink to={routes.subscriptions}>
            All Payments
          </HeaderLink>
        </span>
      </div>
      <div className="fl w-50 tr fr">
        <HeaderLink
          to={routes.subscriptionsNew}
          className="Header--new-payment"
        >
          + New payment
        </HeaderLink>
        <HeaderMenu onLogoutClick={onLogoutClick} />
      </div>
    </div>
  )

  const renderNotLogged = () => (
    <HeaderLink to={routes.login} className="fr">
      Log in
    </HeaderLink>
  )

  return (
    <Styles>
      {/* Header */}
      <div className="Header bb bw2 b--near-white">
        <section className="Header--top-menu mw8-ns center pa4 pb0">
          <div className="ma2 mh0">
            <Link
              to={routes.root}
              className="f1 mt0 no-underline black b tracked-tight v-mid subs-pink-darker"
            >
              Subs
            </Link>
          </div>
          <div className="cf mt3">
            {currentUser.isLogged ? renderLogged() : renderNotLogged()}
          </div>
        </section>
      </div>
      <LoadingBar style={{ backgroundColor: '#BC274E', marginTop: -4, height: 4 }} />
    </Styles>
  )
}

Header.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
}

export default Header
