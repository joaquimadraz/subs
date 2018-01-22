import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SingleDatePicker } from 'react-dates'

import { dateTimeFormat } from 'constants'
import { formatDateToISO8601, toMoment } from 'utils/dt'
import Styles from './Styles'

// TODO:
// Remove this after finding alternative for changing picker value on acceptance test.
// If using portal (modal) is not possible to set date value.
const withDatePickerPortal = process.env.NODE_ENV !== 'acceptance'

class DatePicker extends Component {
  constructor(props) {
    super(props)

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnFocusChange = this.handleOnFocusChange.bind(this)

    this.state = {
      focused: false,
      date: props.value ? toMoment(props.value) : toMoment(),
    }
  }

  handleOnChange(newDate) {
    // newDate may be null if we edit the input manually. eg. acceptance test.
    // It's set as a moment date when we write a valid date
    if (!newDate) {
      this.setState({ date: null })
      return
    }

    this.props.onChange(formatDateToISO8601(newDate.startOf('day')))
    this.setState({ date: newDate })
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
    const { focused, date } = this.state
    const { className } = this.props

    return (
      <Styles className={className}>
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
          readOnly={false}
          withPortal={withDatePickerPortal}
        />
      </Styles>
    )
  }
}

DatePicker.defaultProps = {
  onChange: () => {},
  className: '',
}

DatePicker.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
}

export default DatePicker
