/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from 'co-body'

// eslint-disable-next-line prettier/prettier
import type { Items } from '../types/Items'
const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export async function teste(context: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, Vtex, apps },
    vtex: {
      route: { params },
    },
  } = context

  const { skuId } = params

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  const res = await Vtex.getSkuAndContext('lojasantoantonio', `${skuId}`)
  console.log(res)

  const response = await Propz.getPromotion(
    settings.domain,
    settings.token,
    43012319867,
    settings.username,
    settings.password
  )

  context.body = response
  await next()
}

// get iFrame promotion
export async function getPromotion(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, Vtex,  apps },
  } = ctx

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([
    settings.domain,
    settings.token,
    settings.username,
    settings.password,
    settings.storeId,
  ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    const response = await Propz.getPromotion(
      settings.domain,
      settings.token,
      query.document,
      settings.username,
      settings.password
    )

    const data = response.items.reduce(async ( acc: any , propzItem: Items ) => {
      const productRefPropz = propzItem.promotion.properties.PRODUCT_ID_INCLUSION

      if(propzItem.active && propzItem.promotion.active){

        const [ vtexData ] = await Vtex.getSkuAndContext('lojasantoantonio',  productRefPropz)
        
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
    ctx.body = await data
  } catch (error) {
    ctx.status = 400
    ctx.body = err
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
    // vtex: {
    //   route: { params },
    // },
  } = ctx

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  const items: never[] = []

  const response = await Propz.postVerifyPurchase(
    settings.domain,
    settings.token,
    settings.username,
    settings.password,
    items
  )

  ctx.status = 200
  ctx.body = response

  await next()
}

export async function postRegisterPurchase(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz, apps },
    // vtex: {
    //   route: { params },
    // },
  } = ctx

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  const items: never[] = []

  const response = await Propz.postRegisterPurchase(
    settings.domain,
    settings.token,
    settings.username,
    settings.password,
    items
  )

  ctx.status = 200
  ctx.body = response

  await next()
}

export async function getFormUrl(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { apps },
  } = ctx

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  ctx.status = 200
  const response = {
    formUrl: settings.formUrl,
    storeId: settings.storeId,
  }

  ctx.body = response
  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function getPromotionJson(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, apps },
  } = ctx

  const { query } = ctx.request

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  const validation = await Propz.checkFields([
    settings.domain,
    settings.token,
    settings.username,
    settings.password,
    settings.storeId,
  ])

  const body = validation
    ? await Propz.getPromotionJson(
        settings.domain,
        settings.token,
        query.user,
        settings.username,
        settings.password
      )
    : { success: false, message: 'fill in all fields within the admin' }

  ctx.status = 200
  ctx.body = body
  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function getProductList(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, apps },
  } = ctx

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([
    settings.domain,
    settings.token,
    settings.username,
    settings.password,
    settings.storeId,
  ])

  const body = validation
    ? await Propz.getProductList(
        settings.domain,
        settings.token,
        query.document,
        settings.username,
        settings.password
      )
    : { success: false, message: 'fill in all fields within the admin' }

  ctx.status = 200

  ctx.body = body
  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postPromotion(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, apps },
  } = ctx

  const app: string = getAppId()
  const settings = await apps.getAppSettings(app)
  const reqBody = await json(ctx.req)

  const validation = await Propz.checkFields([
    settings.domain,
    settings.token,
    settings.username,
    settings.password,
    settings.storeId,
  ])

  const body = validation
    ? await Propz.postPromotion(
        settings.domain,
        settings.token,
        settings.username,
        settings.password,
        reqBody
      )
    : { success: false, message: 'fill in all fields within the admin' }

  ctx.status = 200

  ctx.body = body
  ctx.set('cache-control', 'no-cache')
  await next()
}
