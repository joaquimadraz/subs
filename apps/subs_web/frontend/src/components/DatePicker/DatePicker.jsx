import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SingleDatePicker } from 'react-dates'

import { dateTimeFormat } from 'constants'
import moment from 'moment'
import { formatDateToISO8601, parseFromISO8601 } from 'utils/dt'
import Styles from './Styles'

class DatePicker extends Component {
  constructor() {
    super()

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnFocusChange = this.handleOnFocusChange.bind(this)

    this.state = {
      focused: false,
    }
  }

  handleOnChange(date) {
    this.props.onChange(formatDateToISO8601(date.startOf('day')))
  }

  handleOnFocusChange() {
    const setFocused = (prevState) => {
      const newState = prevState
      newState.focused = !prevState.focused
      return newState
    }

    this.setState(setFocused)
  }

  render() {
    const { focused } = this.state
    const { value } = this.props
    const date = value ? moment(parseFromISO8601(value)) : moment()

    return (
      <Styles>
        <SingleDatePicker
          date={date}
          daySize={40}
          focused={focused}
          onDateChange={(this.handleOnChange)}
          onFocusChange={this.handleOnFocusChange}
          /* Allow dates before today to be selected */
          isOutsideRange={() => false}
          /* Hide help button */
          hideKeyboardShortcutsPanel
          displayFormat={dateTimeFormat}
          withPortal
        />
      </Styles>
    )
  }
}

DatePicker.defaultProps = {
  onChange: () => {},
}

DatePicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
}

export default DatePicker
