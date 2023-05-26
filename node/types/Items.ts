export interface Items {
  active: boolean
  promotion: {
    active: boolean
    discountAmount: number
    discountPercent: number
    finalPrice: number
    properties: {
      PRODUCT_ID_INCLUSION: string
    }
  }
}
