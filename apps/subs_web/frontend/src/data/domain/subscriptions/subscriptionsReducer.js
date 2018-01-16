import { Map, OrderedSet } from 'immutable'
import RemoteCall from 'data/domain/RemoteCall'

import { LOGOUT_SUCCESS } from '../currentUser/logout/action'

import {
  CREATE_SUBSCRIPTION_STARTED,
  CREATE_SUBSCRIPTION_SUCCESS,
  CREATE_SUBSCRIPTION_FAILURE,
  CREATE_SUBSCRIPTION_RESET,
} from './createSubscription/action'

import {
  createSubscriptionStarted,
  createSubscriptionSuccess,
  createSubscriptionFailure,
} from './createSubscription/reducer'

import {
  GET_ALL_SUBSCRIPTIONS_STARTED,
  GET_ALL_SUBSCRIPTIONS_SUCCESS,
  GET_ALL_SUBSCRIPTIONS_FAILURE,
} from './getAllSubscriptions/action'

import {
  getAllSubscriptionsStarted,
  getAllSubscriptionsSuccess,
  getAllSubscriptionsFailure,
} from './getAllSubscriptions/reducer'

import {
  ARCHIVE_SUBSCRIPTION_STARTED,
  ARCHIVE_SUBSCRIPTION_SUCCESS,
  ARCHIVE_SUBSCRIPTION_FAILURE,
} from './archiveSubscription/action'

import {
  archiveSubscriptionStarted,
  archiveSubscriptionSuccess,
  archiveSubscriptionFailure,
} from './archiveSubscription/reducer'

import {
  GET_SUBSCRIPTION_STARTED,
  GET_SUBSCRIPTION_SUCCESS,
  GET_SUBSCRIPTION_FAILURE,
} from './getSubscription/action'

import {
  getSubscriptionStarted,
  getSubscriptionSuccess,
  getSubscriptionFailure,
} from './getSubscription/reducer'

import {
  UPDATE_SUBSCRIPTION_STARTED,
  UPDATE_SUBSCRIPTION_SUCCESS,
  UPDATE_SUBSCRIPTION_FAILURE,
} from './updateSubscription/action'

import {
  updateSubscriptionStarted,
  updateSubscriptionSuccess,
  updateSubscriptionFailure,
} from './updateSubscription/reducer'

const initialState = Map({
  entities: Map(),
  ids: OrderedSet(),
  avgs: Map({
    monthly: 0,
    yearly: 0,
  }),
  month: Map({
    subscriptions: OrderedSet(),
    total: 0,
  }),
  prevMonth: Map({
    subscriptions: OrderedSet(),
    total: 0,
  }),
  nextMonth: Map({
    subscriptions: OrderedSet(),
    total: 0,
  }),
  remoteCall: new RemoteCall(),
})

const subscriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SUBSCRIPTION_STARTED:
      return createSubscriptionStarted(state)
    case CREATE_SUBSCRIPTION_SUCCESS:
      return createSubscriptionSuccess(state, action)
    case CREATE_SUBSCRIPTION_FAILURE:
      return createSubscriptionFailure(state, action)
    case CREATE_SUBSCRIPTION_RESET:
      return state.set('remoteCall', initialState.get('remoteCall'))
    case GET_ALL_SUBSCRIPTIONS_STARTED:
      return getAllSubscriptionsStarted(state)
    case GET_ALL_SUBSCRIPTIONS_SUCCESS:
      return getAllSubscriptionsSuccess(state, action)
    case GET_ALL_SUBSCRIPTIONS_FAILURE:
      return getAllSubscriptionsFailure(state, action)
    case ARCHIVE_SUBSCRIPTION_STARTED:
      return archiveSubscriptionStarted(state)
    case ARCHIVE_SUBSCRIPTION_SUCCESS:
      return archiveSubscriptionSuccess(state, action)
    case ARCHIVE_SUBSCRIPTION_FAILURE:
      return archiveSubscriptionFailure(state, action)
    case GET_SUBSCRIPTION_STARTED:
      return getSubscriptionStarted(state)
    case GET_SUBSCRIPTION_SUCCESS:
      return getSubscriptionSuccess(state, action)
    case GET_SUBSCRIPTION_FAILURE:
      return getSubscriptionFailure(state, action)
    case UPDATE_SUBSCRIPTION_STARTED:
      return updateSubscriptionStarted(state)
    case UPDATE_SUBSCRIPTION_SUCCESS:
      return updateSubscriptionSuccess(state, action)
    case UPDATE_SUBSCRIPTION_FAILURE:
      return updateSubscriptionFailure(state, action)
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default subscriptionsReducer
export { initialState }
