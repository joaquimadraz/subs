import { Record } from 'immutable'

const remoteData = {
  name: null,
  email: null,
  currency: null,
  currencySymbol: null,
}

const objectData = {
  authToken: null,
  isLogged: false,
  wasRequested: false,
}

const CurrentUserRecord = Record(Object.assign({}, remoteData, objectData))

class CurrentUser extends CurrentUserRecord {
  // Extend immutable js Record
}

export function parseCurrentUser(remoteData) {
  const {
    name,
    email,
    currency,
    currency_symbol,
  } = remoteData

  return new CurrentUser({
    name,
    email,
    currency,
    currencySymbol: currency_symbol,
  })
}

export default CurrentUser
