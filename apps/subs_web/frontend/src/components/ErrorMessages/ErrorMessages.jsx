import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'

const errorMessages = (errors) => {
  if (errors.size === 0) { return [] }

  return errors.reduce((messages, errorsList, attribute) => {
    const inlineErrors = errorsList.join(', ')

    messages.push({
      attribute,
      message: (<div><b>{attribute}</b>: {inlineErrors}</div>)
    })
    return messages
  }, [])
}

const ErrorMessages = ({ errors }) => {
  const messageList = errorMessages(errors)

  return (
    <div className="bg-light-red pa2 f6 ba b--red br2 bw1 mb3">
      <p className="b pa0 ma0 white f5">There are some errors</p>
      <ul className="list pa1 mt1 mb0 white">
        {messageList.map(error => <li className="ml1" key={error.attribute}>{error.message}</li>)}
      </ul>
    </div>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.instanceOf(Map).isRequired,
}

export default ErrorMessages
