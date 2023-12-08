export const finalPricePropz = (propsData: any, skuPrice: any) => {
  const { mechanic } = propsData

  if (
    mechanic === 'reduced_price' ||
    mechanic === 'virtual_pack' ||
    mechanic === 'get_and_pay'
  ) {
    return propsData.finalPrice
  }

  if (mechanic === 'money_off') {
    const result = skuPrice - propsData.discountAmount

    return result
  }

  if (mechanic === 'percent_off') {
    const descont = skuPrice * (propsData.discountPercent / 100)
    const result = skuPrice - descont

    return result
  }

  return null
}
