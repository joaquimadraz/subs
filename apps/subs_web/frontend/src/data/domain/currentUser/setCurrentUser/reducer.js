import { parseCurrentUser } from 'data/domain/currentUser/CurrentUser'

const setCurrentUser = (state, { data, meta }) => {
  return parseCurrentUser(data)
    .set('authToken', meta.auth_token)
    .set('wasRequested', true)
    .set('isLogged', true)
}

export {
  setCurrentUser,
}
