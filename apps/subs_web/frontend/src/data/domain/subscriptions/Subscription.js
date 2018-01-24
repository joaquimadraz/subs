import { Record } from 'immutable'

import { parseAndFormatDate, daysBetween, now } from 'utils/dt'
import colors from 'constants/colors'

const remoteData = {
  id: null,
  name: '',
  color: colors.default,
  description: null,
  amount: '1',
  cycle: 'monthly',
  amount_currency: 'GBP',
  amount_currency_symbol: null,
  first_bill_date: null,
  next_bill_date: null,
  current_bill_date: null,
  service_code: '',
  type: null,
  type_description: null,
}

const SubscriptionRecord = Record(remoteData)

class Subscription extends SubscriptionRecord {
  // Extend immutable js Record
  get humanFirstBillDate() {
    return parseAndFormatDate(this.first_bill_date)
  }

  get humanNextBillDate() {
    return parseAndFormatDate(this.next_bill_date)
  }

  get humanCurrentBillDate() {
    return this.current_bill_date ? parseAndFormatDate(this.current_bill_date) : null
  }

  get textColor() {
    return colors.textColorForBg(this.color)
  }

  get amountFormatted() {
    return `${this.amount_currency_symbol}${this.amount}`
  }

  get isCurrentDue() {
    if (!this.current_bill_date) { return false }

    return daysBetween(this.current_bill_date, now()) < 0
  }

  get isYearly() {
    return this.cycle === 'yearly'
  }
}

export function parseSubscription(data) {
  return new Subscription(data)
}

export default Subscription
