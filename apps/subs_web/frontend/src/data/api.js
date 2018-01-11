import axios from 'axios'
import Cookies from 'js-cookie'

// public

const postUsers = params =>
  axios.post('/api/users', params)

const postUsersAuthenticate = params =>
  axios.post('/api/users/authenticate', params)

const postUsersConfirm = params =>
  axios.post('/api/users/confirm', params)

const postUsersRecoverPassword = params =>
  axios.post('/api/users/recover_password', params)

const postUsersResetPassword = (token, params) =>
  axios.post(`/api/users/reset_password?t=${token}`, params)

const getPasswordReset = token =>
  axios.get(`/api/password/reset?t=${token}`)

// authenticated

const authHeader = () => {
  const token = Cookies.get('auth-token')

  return token ? { Authorization: `Bearer ${token}` } : {}
}

const getUsersMe = () =>
  axios.get('/api/users/me', { headers: authHeader() })

const postSubscriptions = params =>
  axios.post('/api/subscriptions', params, { headers: authHeader() })

const getSubscriptions = params =>
  axios.get('/api/subscriptions', { params, headers: authHeader() })

const patchSubscription = (subscriptionId, params) =>
  axios.patch(`/api/subscriptions/${subscriptionId}`, params, { headers: authHeader() })

const getSubscription = subscriptionId =>
  axios.get(`/api/subscriptions/${subscriptionId}`, { headers: authHeader() })

const getServices = () =>
  axios.get('/api/services', { headers: authHeader() })

export default {
  postUsers,
  postUsersAuthenticate,
  postUsersConfirm,
  postUsersRecoverPassword,
  postUsersResetPassword,
  getUsersMe,
  postSubscriptions,
  getSubscriptions,
  patchSubscription,
  getSubscription,
  getServices,
  getPasswordReset,
}
