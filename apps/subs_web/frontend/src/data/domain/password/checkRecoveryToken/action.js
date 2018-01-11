import api from 'data/api'

const CHECK_RECOVERY_TOKEN_STARTED = 'CHECK_RECOVERY_TOKEN_STARTED'
const CHECK_RECOVERY_TOKEN_SUCCESS = 'CHECK_RECOVERY_TOKEN_SUCCESS'
const CHECK_RECOVERY_TOKEN_FAILURE = 'CHECK_RECOVERY_TOKEN_FAILURE'

function handleCheckStarted(dispatch) {
  dispatch({ type: CHECK_RECOVERY_TOKEN_STARTED })
}

function handleCheckSuccess(dispatch, response) {
  const { message } = response.data

  dispatch({ type: CHECK_RECOVERY_TOKEN_SUCCESS, message })
}

function handleCheckFailure(dispatch, error) {
  dispatch({ type: CHECK_RECOVERY_TOKEN_FAILURE, error })
}

const checkRecoveryToken = t =>
  (dispatch) => {
    handleCheckStarted(dispatch)

    api.getPasswordReset(t)
      .then(response => handleCheckSuccess(dispatch, response))
      .catch(error => handleCheckFailure(dispatch, error))
  }

export default checkRecoveryToken

export {
  CHECK_RECOVERY_TOKEN_STARTED,
  CHECK_RECOVERY_TOKEN_SUCCESS,
  CHECK_RECOVERY_TOKEN_FAILURE,
}
