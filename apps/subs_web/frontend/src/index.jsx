import Phoenix from 'phoenix_html'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from 'constants/routes'

import '../assets/css'
import initStore from './data/store'
import AppContainer from './containers/AppContainer'
import Home from './routes/Home'
import Signup from './routes/Signup'
import Login from './routes/Login'
import RedirectIfLogged from './routes/RedirectIfLogged'
import UsersConfirmSignup from './routes/Users/routes/ConfirmSignup'

const store = initStore()
const awesomeHistory = syncHistoryWithStore(browserHistory, store)

if (document.getElementById('app')) {
  render(
    <Provider store={store} >
      <Router history={awesomeHistory}>
        <Route path={routes.root} component={AppContainer}>
          <IndexRoute component={Home} />
          <Route component={RedirectIfLogged}>
            <Route path={routes.signup} component={Signup} />
            <Route path={routes.login} component={Login} />
          </Route>
          <Route path={routes.usersConfirmSignup} component={UsersConfirmSignup} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('app'),
  )
}
