// eslint-disable-next-line prettier/prettier
import type { Items } from "./Items"

export interface RegisterPurchase {
  sessionId: string
  customer: {
    customerId: string
  }
  ticket: {
    ticketId: string
    storeId: string
    posId: string
    employeeId: string
    amount: number
    date: string
    blockUpdate: 0
    items: Items[]
  }
}
