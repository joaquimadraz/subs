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

const initialState = Map({
  wasTokenChecked: false,
  isTokenValid: false,
  remoteCall: new RemoteCall(),
})

const passwordReducer = (state = initialState, action) => {
  switch (action.type) {
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
