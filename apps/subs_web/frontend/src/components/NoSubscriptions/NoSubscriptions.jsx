import React from 'react'
import { Link } from 'react-router'
import routes from 'constants/routes'

const NoSubscriptions = () => (
  <div className="no-payments-cta b silver tc">
    <span>You have no payments. Click </span>
    <Link to={routes.subscriptionsNew} className="subs-blue">here</Link>
    <span> to add one.</span>
  </div>
)

export default NoSubscriptions
