import { push } from 'react-router-redux'

import routes from 'constants/routes'

const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT_SUCCESS })
  dispatch(push(routes.login))
}

export default logout

export {
  LOGOUT_SUCCESS,
}
