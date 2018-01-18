import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import rootReducer from './rootReducer'
import initialState from './initialState'
import errorHandler from './errorHandler'

// For Redux Devtools:
// https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const composeEnhancers = process.env.NODE_ENV === 'development'
  ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)
  : compose

const initStore = () => createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(browserHistory),
      loadingBarMiddleware({
        promiseTypeSuffixes: ['STARTED', 'SUCCESS', 'FAILURE'],
      }),
      errorHandler,
    ),
  )
)

export default initStore
