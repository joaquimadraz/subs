import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faThLarge from '@fortawesome/fontawesome-free-solid/faThLarge'
import faFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import routes from 'constants/routes'
import NavigationLink from 'components/NavigationLink'

import Styles from './Styles'

const Navigation = ({ currentUser }) => (
  <Styles>
    <Link
      to={routes.root}
      className="f2 no-underline white b tc db mv4 pa2"
    >
      <div className="b i">OpenSubs</div>
    </Link>
    {currentUser.isLogged && (
      <div>
        <NavigationLink to={routes.root} index>
          <FontAwesomeIcon icon={faThLarge} className="v-mid absolute left-1" />
          Overview
        </NavigationLink>
        <NavigationLink to={routes.subscriptions}>
          <FontAwesomeIcon icon={faFolderOpen} className="v-mid absolute left-1" />
          All Payments
        </NavigationLink>
      </div>
    )}
  </Styles>
)

Navigation.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
}

export default Navigation
