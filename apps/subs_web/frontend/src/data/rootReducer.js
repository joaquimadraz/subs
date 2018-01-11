import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { loadingBarReducer } from 'react-redux-loading-bar'

import signupReducer from 'data/domain/signupReducer'
import loginReducer from 'data/domain/loginReducer'
import passwordReducer from 'data/domain/passwordReducer'
import currentUserReduder from 'data/domain/currentUser/currentUserReducer'
import subscriptionsReducer from 'data/domain/subscriptions/subscriptionsReducer'
import servicesReducer from 'data/domain/services/servicesReducer'

const rootReducer = combineReducers({
  routing: routerReducer,
  signup: signupReducer,
  login: loginReducer,
  password: passwordReducer,
  currentUser: currentUserReduder,
  subscriptions: subscriptionsReducer,
  services: servicesReducer,
  loadingBar: loadingBarReducer,
})

export default rootReducer
