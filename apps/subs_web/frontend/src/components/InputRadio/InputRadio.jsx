import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const InputRadio = ({
  className,
  name,
  options,
  value,
  onChange,
}) => {
  if (options.length === 0) { return null }

  const renderOption = (option) => {
    const key = `${name}-${option.value}`

    return (
      <label key={key} htmlFor={key} className="mr2 gray">
        <input
          type="radio"
          className={classNames(className)}
          id={key}
          name={name}
          checked={option.value === value}
          onChange={() => onChange(name, option.value)}
        />

        {option.label}
      </label>
    )
  }

  return (
    <div>
      {options.map(renderOption)}
    </div>
  )
}

InputRadio.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.instanceOf(Object),
  value: PropTypes.string,
  onChange: PropTypes.func,
}

InputRadio.defaultProps = {
  name: '',
  className: '',
  options: [],
  value: '',
  onChange: () => {},
}

export default InputRadio
