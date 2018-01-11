import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'

const resetState = state => state.set('remoteCall', new RemoteCall())

const resetPasswordStarted = (state) => {
  return resetState(state).setIn(['remoteCall', 'loading'], true)
}

const resetPasswordSuccess = (state, { message }) => {
  return resetState(state)
    .set('wasPasswordUpdated', true)
    .setIn(['remoteCall', 'loading'], false)
    .setIn(['remoteCall', 'message'], message)
}

const resetPasswordFailure = (state, { error }) => {
  return state.set('remoteCall', parseErrorResponse(error))
}

export {
  resetPasswordStarted,
  resetPasswordSuccess,
  resetPasswordFailure,
}
