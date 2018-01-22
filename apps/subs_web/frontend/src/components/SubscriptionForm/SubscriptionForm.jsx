import React from 'react'
import PropTypes from 'prop-types'
import { OrderedSet } from 'immutable'
import classNames from 'classnames'

import RemoteCall from 'data/domain/RemoteCall'
import Subscription from 'data/domain/subscriptions/Subscription'
import colors from 'constants/colors'

import ErrorMessages from 'components/ErrorMessages'
import ColorPicker from 'components/ColorPicker'
import DatePicker from 'components/DatePicker'
import Button from 'components/Button'
import InputText from 'components/InputText'
import InputNumber from 'components/InputNumber'
import InputSelect from 'components/InputSelect'

const renderErrors = (remoteCall) => {
  if (remoteCall.loading || !remoteCall.data) { return null }

  return <ErrorMessages errors={remoteCall.data.get('errors')} />
}

const buildServiceOptions = (services) => {
  const servicesOptions = services.map(service => ({
    value: service.code,
    color: service.color,
    label: service.name,
  })).toJS()

  servicesOptions.push({
    value: 'custom',
    color: colors.default,
    label: 'Custom',
  })

  return servicesOptions
}

const SubscriptionForm = ({ subscription, services, onClick, onChange, remoteCall, children }) => {
  const handleChange = (event, attribute) => {
    onChange(attribute, event.target.value)
  }

  const handleServiceChange = (option) => {
    onChange('color', option.color)
    onChange('service_code', (option.value === 'custom' ? null : option.value))
  }

  const servicesOptions = buildServiceOptions(services)

  const renderCustomServiceForm = () => {
    return (
      <div>
        <div className="b dark-gray mb2">
          What’s the payment about?
        </div>
        {!subscription.id &&
          <InputSelect
            className="subscription-service w-50"
            value={subscription.service_code || 'custom'}
            options={servicesOptions}
            onChange={handleServiceChange}
          />
        }
        <InputText
          name="name"
          placeholder="Name"
          className="subscription-name mt2 w-70"
          value={subscription.name}
          onChange={event => handleChange(event, 'name')}
        />
        <div className="b dark-gray mb2 mt3">
          Amount
        </div>
        <div>
          <span className="f4 mr2 v-mid dark-gray">
            {subscription.amount_currency_symbol}
          </span>
          <InputNumber
            name="amount"
            className="subscription-amount w-30 v-mid mr2"
            value={subscription.amount}
            onChange={event => handleChange(event, 'amount')}
          />
          <select
            style={{ height: 35 }}
            className="subscription-cycle"
            onChange={event => handleChange(event, 'cycle')}
            value={subscription.cycle}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="b dark-gray mb2 mt3">
          First bill
        </div>
        <DatePicker
          className="subscription-first-bill-date"
          value={subscription.first_bill_date}
          onChange={date => onChange('first_bill_date', date)}
        />
        <div>
          <div className="b dark-gray mb2 mt3">Colors</div>
          <ColorPicker
            onChange={color => onChange('color', color)}
          />
        </div>
      </div>
    )
  }

  const renderServiceForm = () => {
    const amountCx = classNames('b dark-gray mb2', {
      mt3: !subscription.id,
      mt0: subscription.id,
    })

    return (
      <div>
        {!subscription.id &&
          <div>
            <div className="b dark-gray mb2">
              What’s the payment about?
            </div>
            <InputSelect
              className="subscription-service w-50"
              value={subscription.service_code || 'custom'}
              options={servicesOptions}
              onChange={handleServiceChange}
            />
          </div>
        }
        <div className={amountCx}>
          Amount
        </div>
        <div>
          <span className="f4 mr2 v-mid dark-gray">
            {subscription.amount_currency_symbol}
          </span>
          <InputNumber
            name="amount"
            className="subscription-amount w-30 v-mid mr2"
            value={subscription.amount}
            onChange={event => handleChange(event, 'amount')}
          />
          <select
            style={{ height: 35 }}
            className="subscription-cycle"
            onChange={event => handleChange(event, 'cycle')}
            value={subscription.cycle}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="b dark-gray mb2 mt3">
          First bill
        </div>
        <DatePicker
          className="subscription-first-bill-date"
          value={subscription.first_bill_date}
          onChange={date => onChange('first_bill_date', date)}
        />
      </div>
    )
  }

  return (
    <div id="subscription-form">
      {renderErrors(remoteCall)}
      {
        subscription.service_code
          ? renderServiceForm()
          : renderCustomServiceForm()
      }
      <div className="mv3 bb b--near-white" />
      <Button type="submit" onClick={onClick} className="mr3">Save</Button>
      {children}
    </div>
  )
}

SubscriptionForm.propTypes = {
  subscription: PropTypes.instanceOf(Subscription),
  services: PropTypes.instanceOf(OrderedSet),
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  remoteCall: PropTypes.instanceOf(RemoteCall),
}

SubscriptionForm.defaultProps = {
  services: OrderedSet(),
}

export default SubscriptionForm
