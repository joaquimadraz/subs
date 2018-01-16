import { push } from 'react-router-redux'

import api from 'data/api'
import routes from 'constants/routes'

const CREATE_SUBSCRIPTION = 'CREATE_SUBSCRIPTION'
const CREATE_SUBSCRIPTION_STARTED = 'CREATE_SUBSCRIPTION_STARTED'
const CREATE_SUBSCRIPTION_SUCCESS = 'CREATE_SUBSCRIPTION_SUCCESS'
const CREATE_SUBSCRIPTION_FAILURE = 'CREATE_SUBSCRIPTION_FAILURE'
const CREATE_SUBSCRIPTION_RESET = 'CREATE_SUBSCRIPTION_RESET'

function handleCreateStarted(dispatch) {
  dispatch({ type: CREATE_SUBSCRIPTION_STARTED })
}

function handleCreateSuccess(dispatch, response) {
  const { data, meta } = response.data

  dispatch({ type: CREATE_SUBSCRIPTION_SUCCESS, data, meta })
  dispatch(push(routes.subscriptions))
}

function handleCreateFailure(dispatch, error) {
  dispatch({ type: CREATE_SUBSCRIPTION_FAILURE, error })
}

const createSubscription = (params = {}) =>
  (dispatch) => {
    handleCreateStarted(dispatch)

    api.postSubscriptions(params)
      .then(response => handleCreateSuccess(dispatch, response))
      .catch(error => handleCreateFailure(dispatch, error))
  }

export default createSubscription

export {
  CREATE_SUBSCRIPTION,
  CREATE_SUBSCRIPTION_STARTED,
  CREATE_SUBSCRIPTION_SUCCESS,
  CREATE_SUBSCRIPTION_FAILURE,
  CREATE_SUBSCRIPTION_RESET,
}
