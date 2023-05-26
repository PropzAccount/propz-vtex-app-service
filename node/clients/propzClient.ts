/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line prettier/prettier
import type { IOContext, InstanceOptions} from '@vtex/api';
import { ExternalClient } from '@vtex/api'
import btoa from 'btoa'

interface Response {
  message: string
}

export default class PropzClient extends ExternalClient {
  
  constructor(context: IOContext, options?: InstanceOptions) {
    super("", context, {
      ...options,
      retries: 2,
    })
  }

  public async checkFields(fields: any[]) {
    try {
      let valid = true

      fields.forEach(field => {
        valid =
          field === undefined ? false : field === '' ? false : field != null

        return field
      })

      return valid
    } catch (err) {
      return { error: err.message }
    }
  }

  public async test(){
    console.log(this.context, 'context')

    return 'teste'
  }

  // eslint-disable-next-line max-params
  public async getPromotion(
    domain: string,
    token: string,
    document: number,
    username: string,
    password: string
  ) {
    const auth = `Basic ${btoa(`${username}:${password}`)}`

    return this.http.get(
       `https://${domain}/v1/databases/${token}/retail/user-promotions/${document}`,
       {
         metric: 'getPromotion',
         nullIfNotFound: true,
         headers: {
           Authorization: auth,
           'Content-Type': 'application/json',
         },
       }
     )
  }


  // eslint-disable-next-line max-params
  public async getPromotionJson(
    domain: string,
    token: string,
    user: string,
    username: string,
    password: string
  ) {
    try {
       const auth = `Basic ${btoa(`${username}:${password}`)}`
      const response = await this.http.getRaw<Response>(
        this.routes.getPromotionJson({ domain }, { token }, { user }),
        {
          metric: 'getPromotionJson',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
      return { error: err.message }
    }
  }

  // eslint-disable-next-line max-params
  public async postVerifyPurchase(domain: string, token: string, username: string, password: string, itemsCart: any) {
    try {
      const auth = `Basic ${btoa(`${username}:${password}`)}`
      const response = await this.http.post(
        `http://${domain}/v1/databases/${token}/retail/pos/verify-purchase/v2`, JSON.stringify(itemsCart) ,{
          headers: {
            metric: 'postVerifyPurchase',
            postVerifyPurchase: true,
            headers: {
              Authorization: auth,
              'Content-Type': 'application/json',
            },
          }
        
      })

      return response

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
      return { error: err.message }
    }
  }

  // eslint-disable-next-line max-params
  public async postRegisterPurchase(domain: string, token: string, username: string, password: string, itemsCart: any) {
    try {
      const auth = `Basic ${btoa(`${username}:${password}`)}`
      const response = await this.http.post(
        `http://${domain}/v1/databases/${token}/retail/pos/register-purchase/v2`, JSON.stringify(itemsCart) ,{
          headers: {
            metric: 'postRegisterPurchase',
            headers: {
              Authorization: auth,
              'Content-Type': 'application/json',
            },
          }
        
      })

      return response

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err) {
      return { error: err.message }
    }
  }

  // eslint-disable-next-line max-params
  public async getProductList(
    domain: string,
    token: string,
    user: string,
    username: string,
    password: string,
  ) {
    try {
      // return product;
      const productList = []
       const auth = `Basic ${btoa(`${username}:${password}`)}`
      const response = await this.http.getRaw<Response>(
        this.routes.getPromotionJson({ domain }, { token }, { user }),
        {
          metric: 'getProductList',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )

      // return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {items} = <any>response.data

      // // const a = await this.getSkuAndContext('maeztraio', '1');
      for (let i = 0; i < items.length; i++) {
        // const skuId = items[i].promotion.properties.PRODUCT_ID_INCLUSION
        // var product = products_mock;
        const product = {
          promotionId: '',
          requiresActivation: true,
          activated: false,
          cacheId: '',
          productId: '', // ProductId
          description: '', // ProductDescription
          productName: '', // ProductName
          productReference: '', // ProductRefId
          linkText: '', // DetailUrl.split('/')[1] ?
          brand: '', // BrandName
          brandId: 0, // BrandId
          link: '', // DetailUrl
          categories: [], // Categories
          categoryId: '', // ProductCategoryIds
          priceRange: {
            sellingPrice: {
              highPrice: 0,
              lowPrice: 0,
              __typename: 'PriceRange',
            },
            listPrice: {
              highPrice: 0,
              lowPrice: 0,
              __typename: 'PriceRange',
            },
            __typename: 'ProductPriceRange',
          },
          specificationGroups: [
            {
              name: 'Group',
              specifications: [
                {
                  name: 'On Sale',
                  values: ['True'],
                },
              ],
            },
            {
              name: 'Group 2',
              specifications: [
                {
                  name: 'Demo',
                  values: ['True'],
                },
                {
                  name: 'PromoExclusion',
                  values: ['1'],
                },
              ],
            },
            {
              name: 'allSpecifications',
              specifications: [
                {
                  name: 'On Sale',
                  values: ['True'],
                },
                {
                  name: 'Demo',
                  values: ['True'],
                },
                {
                  name: 'PromoExclusion',
                  values: ['1'],
                },
              ],
            },
          ],
          skuSpecifications: [], // SkuSpecifications
          productClusters: [],
          clusterHighlights: [],
          properties: [
            {
              name: 'sellerId',
              values: [''],
              __typename: 'Property',
            },
          ],
          __typename: 'Product',
          items: [
            {
              itemId: '', // Id
              name: null,
              nameComplete: null, // NameComplete
              complementName: '', // ComplementName
              ean: '',
              variations: [],
              referenceId: [
                {
                  Key: 'RefId',
                  Value: '', // AlternateIds.RefId
                  __typename: 'Reference',
                },
              ],
              measurementUnit: '', // MeasurementUnit
              unitMultiplier: 0, // UnitMultiplier
              images: [
                {
                  cacheId: '', // Images[].FileId
                  imageId: '', // Images[].FileId
                  imageLabel: null,
                  imageTag: '',
                  imageUrl: '', // Images.ImageUrl
                  imageText: null,
                  __typename: 'Image',
                },
              ],
              __typename: 'SKU',
              sellers: [
                {
                  sellerId: '',
                  sellerName: '',
                  sellerDefault: false,
                  __typename: 'Seller',
                  commertialOffer: {
                    discountHighlights: [],
                    teasers: [],
                    Price: 0,
                    ListPrice: 0,
                    Tax: 0,
                    taxPercentage: 0,
                    spotPrice: 0,
                    PriceWithoutDiscount: 0,
                    RewardValue: 0,
                    PriceValidUntil: '',
                    AvailableQuantity: 0,
                    __typename: 'Offer',
                    Installments: [
                      {
                        Value: 0,
                        InterestRate: 0,
                        TotalValuePlusInterestRate: 0,
                        NumberOfInstallments: 0,
                        Name: '',
                        PaymentSystemName: '',
                        __typename: 'Installment',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }

        // // eslint-disable-next-line no-await-in-loop
        // const skuContext = await this.http.getRaw<Response>(
        //   this.routes.getSkuAndContext({ account }, { skuId }),
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       VtexIdclientAutCookie: this.context.adminUserAuthToken,
        //     },
        //     metric: 'getSkuContext',
        //     nullIfNotFound: true,
        //   }
        // )

        const skuContext: any = {}

        let {finalPrice} = items[i].promotion
        let {originalPrice} = items[i].promotion

        if (
          ['money_off', 'percent_off'].includes(items[i].promotion.mechanic)
        ) {
          // eslint-disable-next-line no-await-in-loop
          // const skuPrice = await this.http.getRaw<Response>(
          //   this.routes.getSkuPrice({ account }, { skuId }),
          //   {
          //     metric: 'getSkuPrice',
          //     nullIfNotFound: true,
          //     headers: {
          //       VtexIdclientAutCookie: this.context.adminUserAuthToken,
          //       'Content-Type': 'application/json',
          //     },
          //   }
          // )

          const skuPrice:any = {}

          const price = <any>skuPrice.data

          if (price != null)
            // eslint-disable-next-line no-empty
            {if (price.fixedPrices.length > 0) {
            } else {
              originalPrice = price.basePrice
              finalPrice =
                items[i].promotion.mechanic === 'money_off'
                  ? originalPrice - items[i].promotion.discountAmount
                  : originalPrice -
                    (originalPrice * items[i].promotion.discountPercent) / 100
            }}
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseSku = <any>skuContext.data

        if (
          originalPrice > 0 &&
          finalPrice > 0 &&
          items[i].promotion.mechanic !== 'spend_and_get' &&
          responseSku &&
          responseSku != null
        ) {
          product.promotionId = items[i].promotion.promotionId
          product.requiresActivation = items[i].promotion.requiresActivation
          product.activated = items[i].activated
          product.productId = responseSku.ProductId
          product.description = responseSku.ProductDescription
          product.productName = responseSku.ProductName
          product.productReference = responseSku.ProductRefId
          product.linkText = responseSku.DetailUrl.split('/')[1]
          product.brand = responseSku.BrandName
          product.brandId = responseSku.BrandId
          product.link = responseSku.DetailUrl
          product.categories = responseSku.Categories
          product.categoryId = responseSku.ProductCategoryIds
          product.priceRange.sellingPrice.highPrice = finalPrice
          product.priceRange.sellingPrice.lowPrice = finalPrice
          product.priceRange.listPrice.highPrice = finalPrice
          product.priceRange.listPrice.lowPrice = finalPrice
          product.skuSpecifications = responseSku.SkuSpecifications
          product.properties[0].values[0] = responseSku.SkuSellers[0].SellerId
          product.items[0].itemId = responseSku.Id
          product.items[0].nameComplete = responseSku.NameComplete
          product.items[0].complementName = responseSku.ComplementName
          product.items[0].referenceId[0].Value = responseSku.AlternateIds.RefId
          product.items[0].measurementUnit = responseSku.MeasurementUnit
          product.items[0].unitMultiplier = responseSku.UnitMultiplier
          product.items[0].images[0].cacheId = responseSku.Images[0].FileId
          product.items[0].images[0].imageId = responseSku.Images[0].FileId
          product.items[0].images[0].imageUrl = responseSku.Images[0].ImageUrl
          product.items[0].sellers[0].sellerId =
            responseSku.SkuSellers[0].SellerId
          product.items[0].sellers[0].commertialOffer.Price = finalPrice
          product.items[0].sellers[0].commertialOffer.ListPrice = originalPrice
          product.items[0].sellers[0].commertialOffer.spotPrice = originalPrice
          product.items[0].sellers[0].commertialOffer.PriceWithoutDiscount = originalPrice
          product.items[0].sellers[0].commertialOffer.AvailableQuantity = 1
          // product.items[0].sellers[0].commertialOffer.AvailableQuantity = items[i].promotion.minQuantity;
          productList.push(product)
        }
      }

      return productList
    } catch (err) {
      return { error: err.message }
    }
  }

  // eslint-disable-next-line max-params
  public async postPromotion(
    domain: string,
    token: string,
    username: string,
    password: string,
    body: any
  ) {
    try {
       const auth = `Basic ${btoa(`${username}:${password}`)}`
      const response = await this.http.postRaw<Response>(
        this.routes.postPromotion({ domain }, { token }),
        JSON.stringify(body),
        {
          metric: 'postPromotion',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (err) {
      return { error: err.message }
    }
  }

  private routes = {
    getPromotionJson: (
      { domain }: { domain: string },
      { token }: { token: string },
      { user }: { user: string }
    ) =>
      `${domain}/v1/databases/${token}/retail/user-promotions/${user}?channel=ecomm`,
    postPromotion: (
      { domain }: { domain: string },
      { token }: { token: string }
    ) => `${domain}/v1/databases/${token}/retail/user-promotions/activate`,
  }

}
