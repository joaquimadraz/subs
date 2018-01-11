import { Map } from 'immutable'
import RemoteCall from 'data/domain/RemoteCall'

import {
  CHECK_RECOVERY_TOKEN_STARTED,
  CHECK_RECOVERY_TOKEN_SUCCESS,
  CHECK_RECOVERY_TOKEN_FAILURE,
} from './password/checkRecoveryToken/action'

import {
  checkRecoveryTokenStarted,
  checkRecoveryTokenSuccess,
  checkRecoveryTokenFailure,
} from './password/checkRecoveryToken/reducer'

import {
  RESET_PASSWORD_STARTED,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from './password/resetPassword/action'

import {
  resetPasswordStarted,
  resetPasswordSuccess,
  resetPasswordFailure,
} from './password/resetPassword/reducer'

const initialState = Map({
  wasPasswordUpdated: false,
  wasTokenChecked: false,
  isTokenValid: false,
  remoteCall: new RemoteCall(),
})

const passwordReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD_STARTED:
      return resetPasswordStarted(state)
    case RESET_PASSWORD_SUCCESS:
      return resetPasswordSuccess(state, action)
    case RESET_PASSWORD_FAILURE:
      return resetPasswordFailure(state, action)
    case CHECK_RECOVERY_TOKEN_STARTED:
      return checkRecoveryTokenStarted(state)
    case CHECK_RECOVERY_TOKEN_SUCCESS:
      return checkRecoveryTokenSuccess(state, action)
    case CHECK_RECOVERY_TOKEN_FAILURE:
      return checkRecoveryTokenFailure(state, action)
    default:
      return state
  }
}

export default passwordReducer
export { initialState }
