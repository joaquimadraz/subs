import api from 'data/api'

const RESET_PASSWORD_STARTED = 'RESET_PASSWORD_STARTED'
const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'
const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE'

function handleResetStarted(dispatch) {
  dispatch({ type: RESET_PASSWORD_STARTED })
}

function handleResetSuccess(dispatch, response) {
  const { message } = response.data

  dispatch({ type: RESET_PASSWORD_SUCCESS, message })
}

function handleResetFailure(dispatch, error) {
  dispatch({ type: RESET_PASSWORD_FAILURE, error })
}

const resetPassword = (token, params) =>
  (dispatch) => {
    handleResetStarted(dispatch)

    api.postUsersResetPassword(token, params)
      .then(response => handleResetSuccess(dispatch, response))
      .catch(error => handleResetFailure(dispatch, error))
  }

export default resetPassword

export {
  RESET_PASSWORD_STARTED,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
}
