import api from 'data/api'

const UPDATE_SUBSCRIPTION = 'UPDATE_SUBSCRIPTION'
const UPDATE_SUBSCRIPTION_STARTED = 'UPDATE_SUBSCRIPTION_STARTED'
const UPDATE_SUBSCRIPTION_SUCCESS = 'UPDATE_SUBSCRIPTION_SUCCESS'
const UPDATE_SUBSCRIPTION_FAILURE = 'UPDATE_SUBSCRIPTION_FAILURE'

function handleUpdateStarted(dispatch) {
  dispatch({ type: UPDATE_SUBSCRIPTION_STARTED })
}

function handleUpdateSuccess(dispatch, response) {
  const { data, meta } = response.data

  dispatch({ type: UPDATE_SUBSCRIPTION_SUCCESS, data, meta })
}

function handleUpdateFailure(dispatch, error) {
  dispatch({ type: UPDATE_SUBSCRIPTION_FAILURE, error })
}

const updateSubscription = (subscriptionId, params = {}) =>
  (dispatch) => {
    handleUpdateStarted(dispatch)

    api.patchSubscription(subscriptionId, params)
      .then(response => handleUpdateSuccess(dispatch, response))
      .catch(error => handleUpdateFailure(dispatch, error))
  }

export default updateSubscription

export {
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_STARTED,
  UPDATE_SUBSCRIPTION_SUCCESS,
  UPDATE_SUBSCRIPTION_FAILURE,
}
