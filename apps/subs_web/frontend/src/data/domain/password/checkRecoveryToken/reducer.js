import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'

const resetState = state => state.set('remoteCall', new RemoteCall())

const checkRecoveryTokenStarted = (state) => {
  return resetState(state).setIn(['remoteCall', 'loading'], true)
}

const checkRecoveryTokenSuccess = (state, { message }) => {
  return resetState(state)
    .set('wasTokenChecked', true)
    .set('isTokenValid', true)
    .setIn(['remoteCall', 'loading'], false)
    .setIn(['remoteCall', 'message'], message)
}

const checkRecoveryTokenFailure = (state, { error }) => {
  return state
    .set('wasTokenChecked', true)
    .set('isTokenValid', false)
    .set('remoteCall', parseErrorResponse(error))
}

export {
  checkRecoveryTokenStarted,
  checkRecoveryTokenSuccess,
  checkRecoveryTokenFailure,
}
