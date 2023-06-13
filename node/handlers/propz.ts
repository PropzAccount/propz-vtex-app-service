/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

// eslint-disable-next-line prettier/prettier
import type { Items } from '../types/Items'

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
    const response = await Propz.getPromotion(domain, token, query.document, username, password)

    const data = response.items.reduce(async ( acc: any , propzItem: Items ) => {
      const productRefPropz = propzItem.promotion.properties.PRODUCT_ID_INCLUSION

      if(propzItem.active && propzItem.promotion.active){

        const [ vtexData ] = await Vtex.getSkuAndContext(account,  productRefPropz)
        
        const productRefVtex = vtexData.items[0].referenceId[0].Value
        
        if(productRefVtex === productRefPropz){
         
          acc.push({
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
                highPrice: propzItem.promotion.finalPrice || 10.99,
                lowPrice: propzItem.promotion.finalPrice || 10.99,
                __typename: 'PriceRange',
              },
              listPrice: {
                highPrice: propzItem.promotion.finalPrice || 20.99,
                lowPrice: propzItem.promotion.finalPrice || 20.99,
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
          })
        }
      }

      return acc
    }, [])

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
    const response = await Propz.getPromotionMassive(domain, token, query.document, username, password)

    // eslint-disable-next-line prefer-const
    const data = response.items.reduce(async ( acc: any , propzItem: Items) => {
      const productRefPropz = propzItem.promotion.properties.PRODUCT_ID_INCLUSION

      if(propzItem.active && propzItem.promotion.active){

        const [ vtexData ] = await Vtex.getSkuAndContext(account,  productRefPropz)
        
        const productRefVtex = vtexData.items[0].referenceId[0].Value
        
        if(productRefVtex === productRefPropz){
          console.log(productRefVtex === productRefPropz)
         
          acc.push({
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
                highPrice: propzItem.promotion.finalPrice || 10.99,
                lowPrice: propzItem.promotion.finalPrice || 10.99,
                __typename: 'PriceRange',
              },
              listPrice: {
                highPrice: propzItem.promotion.finalPrice || 20.99,
                lowPrice: propzItem.promotion.finalPrice || 20.99,
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
          })
        }
      }

      return acc
    }, [])
    
    ctx.status = 200
    ctx.body = await data
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

