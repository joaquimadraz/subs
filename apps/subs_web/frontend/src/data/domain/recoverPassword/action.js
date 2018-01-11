import api from 'data/api'

const RECOVER_PASSWORD_STARTED = 'RECOVER_PASSWORD_STARTED'
const RECOVER_PASSWORD_SUCCESS = 'RECOVER_PASSWORD_SUCCESS'
const RECOVER_PASSWORD_FAILURE = 'RECOVER_PASSWORD_FAILURE'

function handleRecoverPasswordStarted(dispatch) {
  dispatch({ type: RECOVER_PASSWORD_STARTED })
}

function handleRecoverPasswordSuccess(dispatch, response) {
  const { message } = response.data

  dispatch({ type: RECOVER_PASSWORD_SUCCESS, message })
}

function handleRecoverPasswordFailure(dispatch, error) {
  dispatch({ type: RECOVER_PASSWORD_FAILURE, error })
}

const recoverPassword = email =>
  (dispatch) => {
    handleRecoverPasswordStarted(dispatch)

    api.postUsersRecoverPassword({ email })
      .then(response => handleRecoverPasswordSuccess(dispatch, response))
      .catch(error => handleRecoverPasswordFailure(dispatch, error))
  }

export default recoverPassword

export {
  RECOVER_PASSWORD_STARTED,
  RECOVER_PASSWORD_SUCCESS,
  RECOVER_PASSWORD_FAILURE,
}
