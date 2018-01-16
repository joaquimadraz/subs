import React from 'react'
import { Link } from 'react-router'
import routes from 'constants/routes'

import CenteredContainer from 'components/CenteredContainer'

const NotFound = () => (
  <CenteredContainer>
    <div className="white tc">
      <div className="b i f1 white tc mb4">OpenSubs</div>
      <h3>404 Page not found</h3>
      <p>Go back <Link to={routes.root} className="white link subs-blue">home</Link></p>
    </div>
  </CenteredContainer>
)

export default NotFound
