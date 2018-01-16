import { parseSubscription } from 'data/domain/subscriptions/Subscription'
import RemoteCall, { parseErrorResponse } from 'data/domain/RemoteCall'
import { CREATE_SUBSCRIPTION } from './action'

const resetState = state => state.set('remoteCall', new RemoteCall())

const createSubscriptionStarted = (state) => {
  return resetState(state)
    .setIn(['remoteCall', 'loading'], true)
    .setIn(['remoteCall', 'action'], CREATE_SUBSCRIPTION)
}

const createSubscriptionSuccess = (state, { data }) => {
  const subscription = parseSubscription(data)

  return resetState(state)
    .update('ids', set => set.add(subscription.id))
    .setIn(['entities', subscription.id], subscription)
}

const createSubscriptionFailure = (state, { error }) => {
  return state.set('remoteCall', parseErrorResponse(error))
}

export {
  createSubscriptionStarted,
  createSubscriptionSuccess,
  createSubscriptionFailure,
}
