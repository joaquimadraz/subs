import api from 'data/api'

const SIGNUP_STARTED = 'SIGNUP_STARTED'
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
const SIGNUP_FAILURE = 'SIGNUP_FAILURE'
const SIGNUP_RESET = 'SIGNUP_RESET'

function handleSignupStarted(dispatch) {
  dispatch({ type: SIGNUP_STARTED })
}

function handleSignupSuccess(dispatch, response) {
  const { data, meta } = response.data

  dispatch({ type: SIGNUP_SUCCESS, data, meta })
}

function handleSignupFailure(dispatch, error) {
  dispatch({ type: SIGNUP_FAILURE, error })
}

const signup = (params = {}) =>
  (dispatch) => {
    handleSignupStarted(dispatch)

    api.postUsers(params)
      .then(response => handleSignupSuccess(dispatch, response))
      .catch(error => handleSignupFailure(dispatch, error))
  }

export default signup

export {
  SIGNUP_STARTED,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESET,
}
