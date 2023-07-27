/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

// eslint-disable-next-line prettier/prettier
import type { Items } from '../types/Items'
import { finalPricePropz } from '../utils/finalPricePropz'
// import { formatPrice } from '../utils/formatPriceVtex'

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}
  
export async function getPromotion(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, Vtex,  apps },
    vtex: {
      account
    }
  } = ctx


  const app = getAppId()
  const { domain, token, username, password, typePromotion } = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([domain, token, username, password, typePromotion])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    const processPromotionData = async (response: any) => {
      const promotionFilteredOfTypePromotion = response.items.filter((item:{ promotion: { promotionType: string}}) => item.promotion.promotionType === typePromotion)

      const promotions = await Promise.all(promotionFilteredOfTypePromotion.map(async (propzItem: Items ) => {
        if(propzItem.active && propzItem.promotion.active ){

        const PRODUCTS_IDS_INCLUSIONS = propzItem.promotion.properties.PRODUCT_ID_INCLUSION.split(',')
    
         const producsVtex = await Promise.all(PRODUCTS_IDS_INCLUSIONS.map(async(product: string) => {

            const [ vtexData ] = await Vtex.getSkuAndContext(account,  product)

            const productRefVtex = vtexData.items[0].referenceId[0].Value
            const { PriceWithoutDiscount, AvailableQuantity } = vtexData.items[0].sellers[0].commertialOffer

            const priceFinal = Number(finalPricePropz(propzItem.promotion, PriceWithoutDiscount).toFixed(2))

            if(productRefVtex === product && AvailableQuantity > 0){
              return {
                   productId: vtexData.productId,
                   description: vtexData.description,
                   productName: vtexData.productName,
                   productReference: vtexData.productReference,
                   linkText: vtexData.linkText,
                   brand: vtexData.brand,
                   brandId: vtexData.brandId,
                   link: vtexData.link,
                   categories: vtexData.categories,
                   categoryId: vtexData.categoryId,
                   priceRange: {
                     sellingPrice: {
                       highPrice: AvailableQuantity > 0 ? priceFinal : 0,
                       lowPrice: AvailableQuantity > 0 ? priceFinal : 0,
                       __typename: 'PriceRange',
                     },
                     listPrice: {
                       highPrice: AvailableQuantity > 0 ? PriceWithoutDiscount : 0 ,
                       lowPrice: AvailableQuantity > 0 ? PriceWithoutDiscount : 0,
                       __typename: 'PriceRange',
                     },
                     __typename: 'ProductPriceRange',
                   },
                   productClusters: vtexData.productClusters,
                   clusterHighlights: vtexData.clusterHighlights,
                   __typename: 'Product',
                   items: vtexData.items,
                   rule: null,
                   sku: vtexData.items[0],
               }
            }

            return product

          }))

          return producsVtex
        }

     return propzItem   

      }))

      const promotionReduced: any = promotions.reduce((acc: any, promotion) => acc.concat(promotion) , [])

     const removeStringOfArrayObjectPromotions =  promotionReduced.filter((promotion: any) => typeof promotion !== 'string')

      return removeStringOfArrayObjectPromotions
    }
    
    const responsePromotionPropz = await Propz.getPromotionShowCase(domain, token, query.document, username, password)
  
    const data = await processPromotionData(responsePromotionPropz)

    ctx.status = 200
    ctx.body = data
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postVerifyPurchase(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz, Vtex, apps },
    vtex: {
      account
    }
  } = ctx
 
  const app: string = getAppId()
  const { domain, token, username, password, appKey, appToken } = await apps.getAppSettings(app)

  const validation = await Propz.checkFields([domain, token, username, password])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    const { orderForm, verifyPurchase } = await json(ctx.req)
    // console.log(orderForm)
    
    // const itemsTickeks = orderForm.items.map(
    //   (item: { sellingPrice: number, ean: string, quantity: number }, index: number) => {
    //   return {
    //     itemId: String(index),
    //     ean: item.ean,
    //     unitPrice: Number(formatPrice(item.sellingPrice)),
    //     unitSize: "Unit",
    //     quantity: item.quantity,
    //     blockUpdate: 0
    //   }
    // })

    // const verifyPurchase = {
    //   sessionId: orderForm.userProfileId,
    //   customer: {
    //     customerId: document
    //   },
    //   ticket: {
    //     ticketId: orderForm.userProfileId,
    //     "storeId": "3", 
    //     "posId": "1", 
    //     "employeeId": null,
    //     "amount": orderForm.totalizers[0].value, 
    //     "date": new Date(), 
    //     "blockUpdate": 0,
    //     items: itemsTickeks
    //   }
    // }

    const response: any = await Propz.postVerifyPurchase(domain, token, username, password, verifyPurchase)

    const responseGetOrderFormConfiguration = await Vtex.getOrderFormConfiguration(account, appKey, appToken)
    const itemsCartWithPriceChange: any[] = []
    
    const data = await Promise.all(response.ticket.items.map(async (itemPropz: 
    {discounts: Array<{unitPriceWithDiscount: number}>, itemId: string}) => {
  
        if(responseGetOrderFormConfiguration){
          await Vtex.postOrderFormConfigurationPriceManual(account, appKey, appToken, {
             ...responseGetOrderFormConfiguration,
             allowManualPrice: true
          })
  
          const priceOnlyNumber = String(itemPropz.discounts[0].unitPriceWithDiscount).replace(/[^\d]+/, '')

          try {
           const responseVtex: any = await Vtex.putPrice(account, appKey, appToken, orderForm.id, itemPropz.itemId, Number(priceOnlyNumber))

           responseVtex.items.map((item: any , index: number) => {
            if(index === Number(itemPropz.itemId)){
              itemsCartWithPriceChange.push(item)
            }

            return item
           })
          } catch (error) {
            return error
          }
        }
  
        return itemPropz
    }))
      
     await Vtex.postOrderFormConfigurationPriceManual(account, appKey, appToken, {
       ...responseGetOrderFormConfiguration,
       allowManualPrice: false
     })

     
     if(data){
       // const totalItems = orderForm.totalizers.map((totalize: { id: string , value: string}) => {
         //   if(totalize.id === 'Items'){
           //     totalize.value =  response.ticket.amountWithAllDiscount
           //   }
           
           //   return totalize
           // })
           
           const newOrderForm = await Vtex.getOrderForm(account, orderForm.id)
           

      ctx.status = 200
      ctx.body = {
        data: {
          id: newOrderForm.orderFormId,
          items: itemsCartWithPriceChange,
          value: newOrderForm.value,
          totalizers: newOrderForm.totalizers,
          marketingData: newOrderForm.marketingData,
          canEditData: newOrderForm.canEditData,
          loggedIn: newOrderForm.loggedIn,
          paymentData: {
            paymentSystems: newOrderForm.paymentData.paymentSystems,
            payments: newOrderForm.paymentData.payments,
            installmentOptions: newOrderForm.paymentData.installmentOptions,
            availableAccounts: newOrderForm.paymentData.availableAccounts,
            isValid: true,
            "__typename": "PaymentData"
          },
          messages: {
            couponMessages: [],
            generalMessages: [],
            "__typename": "OrderFormMessages"
          },
        shipping: {
          countries: ['BRA'],
          availableAddresses: newOrderForm.shippingData.availableAddresses,
          selectedAddress: newOrderForm.shippingData.selectedAddresses,
          deliveryOptions: newOrderForm.shippingData.logisticsInfo[0].slas,
          pickupOptions: newOrderForm.shippingData.pickupPoints,
          isValid: true,
          "__typename": "Shipping"
        },
        userProfileId: newOrderForm.userProfileId,
        userType: 'CALL_CENTER_OPERATOR',
        clientProfileData: newOrderForm.clientProfileData,
        clientPreferencesData: newOrderForm.clientPreferencesData,
        allowManualPrice: false,
        customData: null,
        "__typename": "OrderForm"
       },
        propzPromotions: {
        sessionId: response.sessionId,
		    customer: {
		    	customerId: response.customer.customerId
		    },
		    ticket: {
		    	ticketId: response.ticket.ticketId,
		    	storeId: response.ticket.storeId,
		    	posId: response.ticket.posId,
		    	employeeId: response.ticket.employeeId,
		    	amount: response.ticket.amount,
		    	amountWithAllDiscount: response.ticket.amountWithAllDiscount,
		    	ticketDiscounts: [],
		    	date: response.ticket.date,
		    	blockUpdate: response.ticket.blockUpdate,
		    	items: response.ticket.items
          }
        }
      }
    }

  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postRegisterPurchase(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz, apps },
  } = ctx

  const app: string = getAppId()
  const { domain, token, username, password } = await apps.getAppSettings(app)

  const validation = await Propz.checkFields([domain,token,username,password ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    const data = await json(ctx.req)
  
    const response = await Propz.postRegisterPurchase(domain, token, username, password, data)
  
    ctx.status = 200
    ctx.body = response
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

