export default {
  root: '/',
  signup: '/signup',
  login: '/login',
  users: '/users',
  usersConfirmSignup: '/users/confirm_signup',
  usersRecoverPassword: '/users/recover_password',
  usersResetPassword: '/users/reset_password',
  subscriptions: '/subscriptions',
  subscriptionsNew: '/subscriptions/new',
  subscriptionsShow: subscriptionId => (`/subscriptions/${subscriptionId}`),
  account: '/account',
}
