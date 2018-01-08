import React from 'react'
import PropTypes from 'prop-types'

import CurrentUser from 'data/domain/currentUser/CurrentUser'
import Button from 'components/Button'
import InputSelect from 'components/InputSelect'

// TODO: User settings
// eslint-disable-next-line
const Account = ({ currentUser }) => {
  return (
    <div className="w-50-l w-80-m center">
      <div className="pa3 br2 bg-near-white">
        <div className="f5 b dark-gray mb2">
          Timezone
        </div>
        <div>
          <InputSelect
            name="timezone"
            value="Europe/London"
            options={[
              { value: 'Europe/London', label: 'Europe/London' },
            ]}
            disabled
          />
        </div>
        <div className="f5 b dark-gray mb2 mt4">
          Notify payments
        </div>
        <div>
          <InputSelect
            name="timezone"
            value="weekly"
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
            disabled
          />
        </div>
        <div>
          <p className="silver mb1">Annual payments will have an additional notification a month early.</p>
        </div>
      </div>
      <div className="pa3">
        <Button disabled>Save</Button>
      </div>
    </div>
  )
}

Account.propTypes = {
  currentUser: PropTypes.instanceOf(CurrentUser).isRequired,
}

export default Account
