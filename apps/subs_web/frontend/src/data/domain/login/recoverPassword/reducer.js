import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'

const resetState = state => state.set('remoteCall', new RemoteCall())

const recoverPasswordStarted = (state) => {
  return resetState(state).setIn(['remoteCall', 'loading'], true)
}

const recoverPasswordSuccess = (state, { message }) => {
  return resetState(state)
    .setIn(['remoteCall', 'loading'], false)
    .setIn(['remoteCall', 'message'], message)
}

const recoverPasswordFailure = (state, { error }) => {
  return state.set('remoteCall', parseErrorResponse(error))
}

export {
  recoverPasswordStarted,
  recoverPasswordSuccess,
  recoverPasswordFailure,
}
