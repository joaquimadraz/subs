import CurrentUser from 'data/domain/currentUser/CurrentUser'
import Cookies from 'js-cookie'

import { LOGIN_SUCCESS } from '../login/login/action'
import { LOGOUT_SUCCESS } from './logout/action'
import {
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAILURE,
} from './getCurrentUser/action'

import { setCurrentUser } from './setCurrentUser/reducer'

const initialState = new CurrentUser()

const saveAuthToken = (user) => {
  Cookies.set('auth-token', user.authToken, {
    expires: Number(process.env.AUTH_TOKEN_EXPIRES || 10),
  })
}

const deleteAuthToken = () => {
  Cookies.remove('auth-token')
}

const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const currentUser = setCurrentUser(state, action)
      saveAuthToken(currentUser)
      return currentUser
    case GET_CURRENT_USER_SUCCESS:
      return setCurrentUser(state, action)
    case GET_CURRENT_USER_FAILURE:
      return new CurrentUser({ wasRequested: true })
    case LOGOUT_SUCCESS:
      deleteAuthToken()
      return new CurrentUser({ wasRequested: true })
    default:
      return state
  }
}

export default currentUserReducer
export { initialState }
