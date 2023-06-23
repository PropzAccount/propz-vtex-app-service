/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

// eslint-disable-next-line prettier/prettier
import type { Items } from '../types/Items'
import { finalPricePropz } from '../utils/finalPricePropz'

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

  const app: string = getAppId()
  const { domain, token, username, password, storeId } = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([domain, token, username, password, storeId])

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
      const promotions = await Promise.all(response.items.map(async (propzItem: Items ) => {
       
        if(propzItem.active && propzItem.promotion.active){

        const PRODUCTS_IDS_INCLUSIONS = propzItem.promotion.properties.PRODUCT_ID_INCLUSION.split(',')
    
         const producsVtex = await Promise.all(PRODUCTS_IDS_INCLUSIONS.map(async(product: string) => {

            const [ vtexData ] = await Vtex.getSkuAndContext(account,  product)

            const productRefVtex = vtexData.items[0].referenceId[0].Value
            const { PriceWithoutDiscount, AvailableQuantity } = vtexData.items[0].sellers[0].commertialOffer

            if(productRefVtex === product){
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
                       highPrice: AvailableQuantity > 0 ? finalPricePropz(propzItem.promotion, PriceWithoutDiscount) : 0,
                       lowPrice: AvailableQuantity > 0 ? finalPricePropz(propzItem.promotion, PriceWithoutDiscount) : 0,
                       __typename: 'PriceRange',
                     },
                     listPrice: {
                       highPrice:PriceWithoutDiscount ,
                       lowPrice:  PriceWithoutDiscount,
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

      const promotionReduced = promotions.reduce((acc: any, promotion) => acc.concat(promotion) , [])

      return promotionReduced
    }
    
    const responsePromotionPropz = await Propz.getPromotion(domain, token, query.document, username, password)
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

export async function getPromotionMassive (ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, Vtex,  apps },
    vtex: {
      account
    }
  } = ctx

  const app: string = getAppId()
  const { domain, token, username, password, storeId } = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([domain, token, username, password, storeId])

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
      const promotions = await Promise.all(response.items.map(async (propzItem: Items ) => {
    
        if(propzItem.active && propzItem.promotion.active){
    
        const PRODUCTS_IDS_INCLUSIONS = propzItem.promotion.properties.PRODUCT_ID_INCLUSION.split(',')
      
         const producsVtex = await Promise.all(PRODUCTS_IDS_INCLUSIONS.map(async(product: string) => {

            const [ vtexData ] = await Vtex.getSkuAndContext(account,  product)

            const productRefVtex = vtexData.items[0].referenceId[0].Value
            const { PriceWithoutDiscount, AvailableQuantity} = vtexData.items[0].sellers[0].commertialOffer
    
            if(productRefVtex === product){
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
                      highPrice:  AvailableQuantity > 0 ? finalPricePropz(propzItem.promotion, PriceWithoutDiscount) : 0,,
                      lowPrice:  AvailableQuantity > 0 ? finalPricePropz(propzItem.promotion, PriceWithoutDiscount) : 0,,
                       __typename: 'PriceRange',
                     },
                     listPrice: {
                       highPrice: PriceWithoutDiscount,
                       lowPrice: PriceWithoutDiscount,
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

      const promotionReduced = promotions.reduce((acc: any, promotion) => acc.concat(promotion) , [])

      return promotionReduced
    }
    
    const responsePromotionPropz = await Propz.getPromotionMassive(domain, token, query.document, username, password)
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
    clients: { Propz, apps },
  } = ctx
 
  const app: string = getAppId()
  const { domain, token, username, password } = await apps.getAppSettings(app)

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
    const data = await json(ctx.req)
  
    const response = await Propz.postVerifyPurchase(domain, token, username, password, data)
  
    ctx.status = 200
    ctx.body = response
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


export async function PostPriceManual(ctx: Context, next: () => Promise<any>){
  const {
    clients: { Propz, Vtex,  apps },
    vtex: {
      account
    }
  } = ctx

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  const app: string = getAppId()
  const { domain, token, username, password, appKey, appToken } = await apps.getAppSettings(app)

  const validation = await Propz.checkFields([domain, token, username, password, appKey, appToken])


  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  const data = await json(ctx.req)
  const { orderFormId, document, items } = data 

  const formatPrice = (price: any) => {
    let value: string = price

    value += '';

    value = value.replace(/[\D]+/g,'');
    value += '';
    value = value.replace(/([0-9]{2})$/g, ".$1");
  
    if (value.length > 6) {
      value = value.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    return value
  }

  const processPromotionData = async (response: any) => {
    const responseGetOrderFormConfiguration = await Vtex.getOrderFormConfiguration(account, appKey, appToken)

    try {
      await Promise.all(response.items.map(async (propzItem: Items ) => {
    
        if(propzItem.active && propzItem.promotion.active){
  
          if(responseGetOrderFormConfiguration){
            await Vtex.postOrderFormConfigurationPriceManual(account, appKey, appToken, {
              ...responseGetOrderFormConfiguration,
              allowManualPrice: true
            })
  
            const PRODUCTS_IDS_INCLUSIONS = propzItem.promotion.properties.PRODUCT_ID_INCLUSION.split(',')
  
            const producsVtex = await Promise.all(PRODUCTS_IDS_INCLUSIONS.map(async(product: string) => {
  
              items.map(async(item: any, index: number) => {
                if(item.productRefId === product){
  
                  const PriceWithoutDiscount = formatPrice(item.price)
                  const price = finalPricePropz(propzItem.promotion, PriceWithoutDiscount)
                  const priceFinal = price && String(price.toFixed(2)).replace(/[^\d]+/g,'')

                  await Vtex.putPrice(account, appKey, appToken, orderFormId, String(index), Number(priceFinal))
                }
  
                return item
              })
          
              return product
    
            }))
             
            return producsVtex
          }
  
        }
  
        return propzItem
  
      }))
      

    } catch (error) {
      ctx.status = 400
      ctx.body = error
    }

    await Vtex.postOrderFormConfigurationPriceManual(account, appKey, appToken, {
      ...responseGetOrderFormConfiguration,
      allowManualPrice: false
    })

    const getOrderForm = await Vtex.getOrderForm(account, orderFormId)

    return getOrderForm.items
  }

  try {
    const responsePromotionPropz = await Propz.getPromotion(domain, token, document, username, password)

    if(responsePromotionPropz.items.length < 0){
      const responsePromotionMassivePropz = await Propz.getPromotionMassive(domain, token, document, username, password)
      const itemsOrderForm = await processPromotionData(responsePromotionMassivePropz)

      ctx.status = 200
      ctx.body = itemsOrderForm
    } else {
      const itemsOrderForm = await processPromotionData(responsePromotionPropz)

      ctx.status = 200
      ctx.body = itemsOrderForm
    }
  
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }
  
  ctx.set('cache-control', 'no-cache')
  next()  
}
