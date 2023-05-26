// eslint-disable-next-line prettier/prettier
import type { Items } from './Items'

export interface VerifyPurchase {
  customer: {
    customerId: string
  }
  ticket: {
    ticketId: string
    storeId: string
    employeeId: string
    amount: number
    date: string
    blockUpdate: number
    items: Items[]
  }
}
