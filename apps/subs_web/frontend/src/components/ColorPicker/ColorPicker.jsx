import React from 'react'
import PropTypes from 'prop-types'
import { GithubPicker } from 'react-color'
import colors from 'constants/colors'

const ColorPicker = ({ value, onChange }) => {
  const handleChange = color => onChange(color.hex)

  return (
    <GithubPicker
      triangle="hide"
      width="100%"
      color={value}
      colors={colors.available}
      onChangeComplete={handleChange}
    />
  )
}

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
}

ColorPicker.defaultProps = {
  value: colors.default,
  onChange: () => {},
}

export default ColorPicker
