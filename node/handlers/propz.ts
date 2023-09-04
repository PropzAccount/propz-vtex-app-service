/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

import { finalPricePropz } from '../utils/finalPricePropz'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Items } from '../types/Items'
import { getVerifyPurchase } from '../utils/getVerifyPurchase'

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export async function getPromotion(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, Vtex, apps },
    vtex: { account },
  } = ctx

  const app = getAppId()
  const {
    domain,
    token,
    username,
    password,
    typePromotion,
  } = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
    typePromotion,
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
    const processIdentifiers = async (productRefIds: string) => {
      if (productRefIds) {
        const PRODUCTS_IDS_INCLUSIONS = productRefIds.split(',')

        for await (const productRefId of PRODUCTS_IDS_INCLUSIONS) {
          const [vtexData] = await Vtex.getSkuAndContext(account, productRefId)

          const isAvailableQuantity =
            vtexData &&
            vtexData.items[0].sellers[0].commertialOffer.AvailableQuantity > 0

          const productRefVtex = vtexData.items[0].referenceId[0].Value

          if (productRefVtex === productRefId && isAvailableQuantity) {
            return vtexData
          }
        }
      }
    }

    const processPromotionData = async (response: any) => {
      const promotionFilteredOfTypePromotion =
        typePromotion === 'PERSONALIZED'
          ? response.items.filter(
              (item: { promotion: { promotionType: string } }) =>
                item.promotion.promotionType === typePromotion
            )
          : response.items

      const promotions = await Promise.all(
        promotionFilteredOfTypePromotion.map(async (propzItem: Items) => {
          try {
            if (propzItem.active && propzItem.promotion.active) {
              const vtexData = await processIdentifiers(
                propzItem.promotion.properties.PRODUCT_ID_INCLUSION
              )

              const {
                PriceWithoutDiscount,
              } = vtexData.items[0].sellers[0].commertialOffer

              const priceFinal = Number(
                finalPricePropz(
                  propzItem.promotion,
                  PriceWithoutDiscount
                ).toFixed(2)
              )

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
                    highPrice: priceFinal,
                    lowPrice: priceFinal,
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

            return propzItem
          } catch (error) {
            return error
          }
        })
      )

      const promotionReduced: any = promotions.reduce(
        (acc: any, promotion) => acc.concat(promotion),
        []
      )

      const removeStringOfArrayObjectPromotions = promotionReduced
        .filter((promotion: any) => typeof promotion !== 'string')
        .filter((promotion: any) => promotion.productId)

      return removeStringOfArrayObjectPromotions
    }

    const responsePromotionPropz = await Propz.getPromotionShowCase(
      domain,
      token,
      query.document,
      username,
      password
    )

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
    vtex: { account },
  } = ctx

  const app: string = getAppId()
  const {
    domain,
    token,
    username,
    password,
    appKey,
    appToken,
  } = await apps.getAppSettings(app)

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
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
    const { orderFormId, document, sessionId } = await json(ctx.req)

    try {
      const orderForm = await Vtex.getOrderForm(account, orderFormId)

      const verifyPurchase = getVerifyPurchase({
        orderForm,
        document,
        sessionId,
      })

      if (verifyPurchase.ticket.items.length > 0) {
        try {
          const response: any = await Propz.postVerifyPurchase(
            domain,
            token,
            username,
            password,
            verifyPurchase
          )

          response.ticket.items.map(
            async (itemPropz: {
              discounts: Array<{ unitPriceWithDiscount: number }>
              itemId: string
            }) => {
              if (itemPropz.discounts.length > 0) {
                const price = Number(
                  itemPropz.discounts[0].unitPriceWithDiscount
                ).toFixed(2)

                const priceFormated = String(price).replace(/[^\d]+/, '')

                try {
                  await Vtex.putPrice(
                    account,
                    appKey,
                    appToken,
                    orderFormId,
                    itemPropz.itemId,
                    Number(priceFormated)
                  )
                } catch (error) {
                  return error
                }
              }

              return itemPropz
            }
          )

          const promotionPurchase = response.ticket.items.filter(
            (item: { discounts: [] }) => item.discounts.length > 0 && item
          )

          ctx.body = {
            response: {
              ...response,
              ticket: {
                ...response.ticket,
                items: promotionPurchase,
              },
            },
          }
        } catch (error) {
          ctx.body = error
        }
      } else {
        ctx.body = {
          response: verifyPurchase,
        }
      }
    } catch (error) {
      ctx.body = error
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

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
  ])

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

    const response = await Propz.postRegisterPurchase(
      domain,
      token,
      username,
      password,
      data
    )

    ctx.status = 200
    ctx.body = response
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}
