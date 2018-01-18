import { push } from 'react-router-redux'
import routes from 'constants/routes'

// TODO: Improve error handler, explicitly handle for 404, 400 and 500 at least
const errorHandler = store => next => (action) => {
  const { error } = action

  if (action.type.endsWith('FAILURE') && error && error.response) {
    const { status } = error.response

    if (status === 404 || status === 400) {
      store.dispatch(push(routes.notFound))
    }
  }

  return next(action)
}

export default errorHandler
