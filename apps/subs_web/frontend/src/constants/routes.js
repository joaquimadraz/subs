export default {
  root: '/',
  signup: '/signup',
  login: '/login',
  usersConfirmSignup: '/users/confirm_signup',
  usersRecoverPassword: '/users/recover_password',
  usersResetPassword: '/users/reset_password',
  subscriptions: '/payments',
  subscriptionsNew: '/payments/new',
  subscriptionsShow: subscriptionId => (`/payments/${subscriptionId}`),
  account: '/account',
  notFound: '/404',
}
