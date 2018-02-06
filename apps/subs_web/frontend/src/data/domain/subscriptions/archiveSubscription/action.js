import api from 'data/api'
import getAllSubscriptionsAction from '../getAllSubscriptions/action'

const ARCHIVE_SUBSCRIPTION_STARTED = 'ARCHIVE_SUBSCRIPTION_STARTED'
const ARCHIVE_SUBSCRIPTION_SUCCESS = 'ARCHIVE_SUBSCRIPTION_SUCCESS'
const ARCHIVE_SUBSCRIPTION_FAILURE = 'ARCHIVE_SUBSCRIPTION_FAILURE'

function handleArchiveStarted(dispatch) {
  dispatch({ type: ARCHIVE_SUBSCRIPTION_STARTED })
}

function handleArchiveSuccess(dispatch, response) {
  const { data, meta } = response.data

  dispatch({ type: ARCHIVE_SUBSCRIPTION_SUCCESS, data, meta })
  dispatch(getAllSubscriptionsAction())
}

function handleArchiveFailure(dispatch, error) {
  dispatch({ type: ARCHIVE_SUBSCRIPTION_FAILURE, error })
}

const archiveSubscription = (subscriptionId, params = {}) =>
  (dispatch) => {
    handleArchiveStarted(dispatch)

    api.patchSubscription(subscriptionId, { subscription: params })
      .then(response => handleArchiveSuccess(dispatch, response))
      .catch(error => handleArchiveFailure(dispatch, error))
  }

export default archiveSubscription

export {
  ARCHIVE_SUBSCRIPTION_STARTED,
  ARCHIVE_SUBSCRIPTION_SUCCESS,
  ARCHIVE_SUBSCRIPTION_FAILURE,
}
