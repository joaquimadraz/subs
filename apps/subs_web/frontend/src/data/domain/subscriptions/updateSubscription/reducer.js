import { parseSubscription } from 'data/domain/subscriptions/Subscription'
import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'
import { UPDATE_SUBSCRIPTION } from './action'

const resetState = state => state.set('remoteCall', new RemoteCall())

const updateSubscriptionStarted = (state) => {
  return resetState(state)
    .setIn(['remoteCall', 'loading'], true)
    .setIn(['remoteCall', 'action'], UPDATE_SUBSCRIPTION)
}

const updateSubscriptionSuccess = (state, { data }) => {
  const subscription = parseSubscription(data)

  return resetState(state).setIn(['entities', subscription.id], subscription)
}

const updateSubscriptionFailure = (state, { error }) => {
  return state.set('remoteCall', parseErrorResponse(error))
}

export {
  updateSubscriptionStarted,
  updateSubscriptionSuccess,
  updateSubscriptionFailure,
}
