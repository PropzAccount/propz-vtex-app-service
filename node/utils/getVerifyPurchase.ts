import { formatPrice } from './formatPriceVtex'

export const getVerifyPurchase = ({ orderForm, document, sessionId }: any) => {
  if (orderForm.items.length > 0) {
    const itemsTickeks = orderForm.items.reduce(
      (
        acc: Array<{
          itemId: string
          ean: string
          unitPrice: number
          quantity: number
          unitSize: string
          blockUpdate: number
        }>,

        currentItem: {
          sellingPrice: number
          ean: string
          quantity: number
          manualPrice: number
          price: number
        },
        index: number
      ) => {
        acc.push({
          itemId: String(index),
          ean: currentItem.ean,
          unitPrice: Number(formatPrice(currentItem.price)),
          unitSize: 'Unit',
          quantity: currentItem.quantity,
          blockUpdate: 0,
        })

        return acc
      },
      []
    )

    return {
      sessionId,
      customer: {
        customerId: document,
      },
      ticket: {
        ticketId: sessionId,
        storeId: '3',
        posId: '1',
        employeeId: null,
        amount: orderForm.totalizers[0].value,
        date: new Date(),
        blockUpdate: 0,
        items: itemsTickeks,
      },
    }
  }

  return {
    sessionId: '',
    customer: {
      customerId: '',
    },
    ticket: {
      ticketId: '',
      storeId: '3',
      posId: '1',
      employeeId: null,
      amount: 0,
      date: '',
      blockUpdate: 0,
      items: [],
    },
  }
}
