import Phoenix from 'phoenix_html'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from 'constants/routes'

import './assets/css'
import initStore from './data/store'
import AppContainer from './containers/AppContainer'
import Home from './routes/Home'
import NotFound from './components/NotFound'

import RedirectIfLogged from './routes/RedirectIfLogged'
import Signup from './routes/Signup'
import Login from './routes/Login'

import RedirectIfNotLogged from './routes/RedirectIfNotLogged'
import UsersConfirmSignup from './routes/Users/routes/ConfirmSignup'
import UsersResetPassword from './routes/Users/routes/ResetPassword'
import NewSubscription from './routes/Subscriptions/routes/NewSubscription'
import ShowSubscription from './routes/Subscriptions/routes/ShowSubscription'
import Subscriptions from './routes/Subscriptions'
import Account from './routes/Account'

const store = initStore()
const awesomeHistory = syncHistoryWithStore(browserHistory, store)

if (document.getElementById('app')) {
  render(
    <Provider store={store} >
      <Router history={awesomeHistory}>
        <Route path={routes.root} component={AppContainer}>
          <IndexRoute component={Home} />
          {/* Public routes */}
          <Route component={RedirectIfLogged}>
            <Route path={routes.signup} component={Signup} />
            <Route path={routes.login} component={Login} />
            <Route path={routes.usersConfirmSignup} component={UsersConfirmSignup} />
            <Route path={routes.usersResetPassword} component={UsersResetPassword} />
          </Route>
          {/* Protected routes */}
          <Route component={RedirectIfNotLogged}>
            <Route path={routes.subscriptions} component={Subscriptions} />
            <Route path={routes.subscriptionsNew} component={NewSubscription} />
            <Route path={routes.subscriptionsShow(':subscriptionId')} component={ShowSubscription} />
            <Route path={routes.account} component={Account} />
          </Route>
        </Route>
        <Route path="*" component={NotFound} />
      </Router>
    </Provider>,
    document.getElementById('app'),
  )
}
