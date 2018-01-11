import { Map } from 'immutable'
import RemoteCall from 'data/domain/RemoteCall'

import {
  LOGIN_STARTED,
  LOGIN_FAILURE,
  LOGIN_RESET,
} from './login/login/action'

import {
  RECOVER_PASSWORD_STARTED,
  RECOVER_PASSWORD_SUCCESS,
  RECOVER_PASSWORD_FAILURE,
} from './login/recoverPassword/action'

import {
  loginStarted,
  loginFailure,
} from './login/login/reducer'

import {
  recoverPasswordStarted,
  recoverPasswordSuccess,
  recoverPasswordFailure,
} from './login/recoverPassword/reducer'

const initialState = Map({
  remoteCall: new RemoteCall(),
})

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_STARTED:
      return loginStarted(state)
    case LOGIN_FAILURE:
      return loginFailure(state, action)
    case LOGIN_RESET:
      return initialState
    case RECOVER_PASSWORD_STARTED:
      return recoverPasswordStarted(state)
    case RECOVER_PASSWORD_SUCCESS:
      return recoverPasswordSuccess(state, action)
    case RECOVER_PASSWORD_FAILURE:
      return recoverPasswordFailure(state, action)
    default:
      return state
  }
}

export default loginReducer
export { initialState }
