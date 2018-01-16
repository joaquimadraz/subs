import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import Styles from './Styles'

const InputSelect = ({ className, ...props }) => {
  const cx = classNames(className).toString()

  return (
    <Styles>
      <Select className={cx} {...props} />
    </Styles>
  )
}

InputSelect.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

InputSelect.defaultProps = {
  name: '',
  className: '',
  placeholder: '',
  value: '',
  onChange: () => { },
  disabled: false,
}

export default InputSelect
