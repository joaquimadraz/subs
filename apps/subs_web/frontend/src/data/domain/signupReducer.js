import { Map } from 'immutable'
import RemoteCall from 'data/domain/RemoteCall'

import {
  SIGNUP_STARTED,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESET,
} from './signup/action'

import {
  signupStarted,
  signupSuccess,
  signupFailure,
} from './signup/reducer'

const initialState = Map({
  signed_up_email: null,
  confirmation_sent_at: null,
  remoteCall: new RemoteCall(),
})

const signupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_STARTED:
      return signupStarted(state)
    case SIGNUP_SUCCESS:
      return signupSuccess(state, action)
    case SIGNUP_FAILURE:
      return signupFailure(state, action)
    case SIGNUP_RESET:
      return initialState
    default:
      return state
  }
}

export default signupReducer
export { initialState }
