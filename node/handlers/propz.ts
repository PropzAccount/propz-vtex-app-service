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
        try {
          if(propzItem.active && propzItem.promotion.active ){

          const PRODUCTS_IDS_INCLUSIONS = propzItem.promotion.properties.PRODUCT_ID_INCLUSION?.split(',')

          if(PRODUCTS_IDS_INCLUSIONS){

            const producsVtex = await Promise.all(PRODUCTS_IDS_INCLUSIONS.map(async(product: string) => {
 
           const [ vtexData ] = await Vtex.getSkuAndContext(account,  product)
           
           if(vtexData){
 
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
 
           }
 
           return product
           
            }))
         
            return producsVtex
          }
        }

        return propzItem

        } catch (error) {
          return error            
        }

      }))
      
      const promotionReduced: any = promotions.reduce((acc: any, promotion) => acc.concat(promotion) , [])

      const removeStringOfArrayObjectPromotions = promotionReduced.filter((promotion: any) => typeof promotion !== 'string').filter((promotion: any) => promotion.productId)

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

    const response: any = await Propz.postVerifyPurchase(domain, token, username, password, verifyPurchase)

    const responseGetOrderFormConfiguration = await Vtex.getOrderFormConfiguration(account, appKey, appToken)
    let itemsCartWithPriceChange: any[] = []

    await Vtex.postOrderFormConfigurationPriceManual(account, appKey, appToken, {
      ...responseGetOrderFormConfiguration,
      allowManualPrice: true
   })
    
    const data = await Promise.all(response.ticket.items.map(async (itemPropz: 
    {discounts: Array<{unitPriceWithDiscount: number}>, itemId: string}) => {
      const price = Number(itemPropz.discounts[0].unitPriceWithDiscount).toFixed(2)
      const priceFormated = String(price).replace(/[^\d]+/, '')

          try {
          await Vtex.putPrice(account, appKey, appToken, orderForm.id, itemPropz.itemId, Number(priceFormated))

          itemsCartWithPriceChange = orderForm.items.map((orderFormItem: any, index: number) => {
            if(Number(itemPropz.itemId) === index && !orderFormItem.manualPrice){
              return {
                ...orderFormItem,
                manualPrice: Number(priceFormated)
              }
            }

            return orderFormItem
           })
         
          } catch (error) {
            return error
          }
        
        return itemPropz
    }))
      
     await Vtex.postOrderFormConfigurationPriceManual(account, appKey, appToken, {
       ...responseGetOrderFormConfiguration,
       allowManualPrice: false
     })

     
     if(data){
      ctx.status = 200
      ctx.body = {
        data: {
        ...orderForm,
          items: itemsCartWithPriceChange,
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

    return
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

