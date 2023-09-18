/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

import { finalPricePropz } from '../utils/finalPricePropz'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Items } from '../types/Items'
import { getVerifyPurchase } from '../utils/getVerifyPurchase'
import { formatPrice } from '../utils/formatPriceVtex'

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

          if (vtexData) {
            const isAvailableQuantity =
              vtexData &&
              vtexData.items[0].sellers[0].commertialOffer.AvailableQuantity > 0

            const productRefVtex = vtexData?.items[0].referenceId[0].Value

            if (productRefVtex === productRefId && isAvailableQuantity) {
              return vtexData
            }
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

              if (vtexData) {
                const {
                  PriceWithoutDiscount,
                  Price,
                  ListPrice,
                } = vtexData.items[0].sellers[0].commertialOffer

                const priceFinal = Number(
                  finalPricePropz(
                    propzItem.promotion,
                    PriceWithoutDiscount
                  ).toFixed(2)
                )

                return {
                  promotionMaxPerCustomer: {
                    pricePropz: {
                      sellingPrice: priceFinal,
                      listPrice: PriceWithoutDiscount,
                    },
                    priceVtex: {
                      sellingPrice: Price,
                      listPrice: ListPrice,
                    },
                    maxItems:
                      propzItem.remainingMaxPerCustomer > 0
                        ? propzItem.remainingMaxPerCustomer
                        : 'full-promotion',
                    product: vtexData.items[0].referenceId[0].Value,
                    typeMechanic: propzItem.promotion.mechanic,
                    quantityFlag: propzItem.promotion.minQuantity,
                  },
                  product: {
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
                  },
                }
              }
            }
          } catch (error) {
            return error
          }
        })
      )

      const promotionReduced: any = promotions.reduce(
        (acc: any, promotion: any) => {
          if (promotion) {
            acc.promotionMaxPerCustomer.push(promotion.promotionMaxPerCustomer)
            acc.products.push(promotion.product)
          }

          return acc
        },
        {
          promotionMaxPerCustomer: [],
          products: [],
        }
      )

      return promotionReduced
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

export async function postPricePDP(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, apps },
  } = ctx

  const app = getAppId()
  const {
    domain,
    token,
    username,
    password,
    typePromotion,
  } = await apps.getAppSettings(app)

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

  const { document, product } = await json(ctx.req)

  const responsePromotionPropz = await Propz.getPromotionShowCase(
    domain,
    token,
    document,
    username,
    password
  )

  const price = responsePromotionPropz.items.reduce(
    (acc: any, currerItem: any) => {
      const { PRODUCT_ID_INCLUSION } = currerItem.promotion.properties

      if (PRODUCT_ID_INCLUSION) {
        const PRODUCTS_IDS_INCLUSIONS = PRODUCT_ID_INCLUSION.split(',')

        PRODUCTS_IDS_INCLUSIONS.map((currentPromotion: any) => {
          if (currentPromotion === product.productReference) {
            const {
              PriceWithoutDiscount,
            } = product.items[0].sellers[0].commertialOffer

            const priceFinal = Number(
              finalPricePropz(
                currerItem.promotion,
                PriceWithoutDiscount
              ).toFixed(2)
            )

            acc = {
              sellingPrice: priceFinal,
              listPrice: PriceWithoutDiscount,
            }
          }

          return currentPromotion
        })
      }

      return acc
    },
    {
      sellingPrice: 0,
      listPrice: 0,
    }
  )

  const sellingPrice =
    price.sellingPrice > 0
      ? price.sellingPrice
      : product.priceRange.sellingPrice.highPrice

  const listPrice =
    price.listPrice > 0
      ? price.listPrice
      : product.priceRange.listPrice.highPrice

  ctx.body = {
    ...product,
    priceRange: {
      sellingPrice: {
        highPrice: sellingPrice,
        lowPrice: sellingPrice,
        __typename: 'PriceRange',
      },
      listPrice: {
        highPrice: listPrice,
        lowPrice: listPrice,
        __typename: 'PriceRange',
      },
      __typename: 'ProductPriceRange',
    },
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

      const responseGetOrderFormConfiguration = await Vtex.getOrderFormConfiguration(
        account,
        appKey,
        appToken
      )

      if (verifyPurchase.ticket.items.length > 0) {
        await Vtex.postOrderFormConfigurationPriceManual(
          account,
          appKey,
          appToken,
          {
            ...responseGetOrderFormConfiguration,
            allowManualPrice: true,
          }
        )

        try {
          const response: any = await Propz.postVerifyPurchase(
            domain,
            token,
            username,
            password,
            verifyPurchase
          )

          console.log(response)

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
                amount: Number(formatPrice(response.ticket.amount)),
                items: promotionPurchase,
              },
            },
          }
        } catch (error) {
          ctx.body = error
        }

        await Vtex.postOrderFormConfigurationPriceManual(
          account,
          appKey,
          appToken,
          {
            ...responseGetOrderFormConfiguration,
            allowManualPrice: false,
          }
        )
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
