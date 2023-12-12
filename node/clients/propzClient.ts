/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line prettier/prettier
import type { IOContext, InstanceOptions} from '@vtex/api';
import { ExternalClient } from '@vtex/api'
import btoa from 'btoa'

export default class PropzClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      retries: 2,
    })
  }

  public async checkFields(fields: any[]) {
    try {
      return fields.every(
        field => field !== undefined && field !== '' && field != null
      )
    } catch (err) {
      return { error: err }
    }
  }

  private getAuthHeader(username: string, password: string) {
    return `Basic ${btoa(`${username}:${password}`)}`
  }

  // eslint-disable-next-line max-params
  public async getPromotionShowCase(
    domain: string,
    token: string,
    document: number,
    username: string,
    password: string,
    storeId: string
  ) {
    const auth = this.getAuthHeader(username, password)

    try {
      return this.http.get(
        `https://${domain}/v1/databases/${token}/retail/promotion-showcase/${document}?channel=ecom&store=${storeId}`,
        {
          metric: 'getPromotionShowcase',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      return error
    }
  }

  // eslint-disable-next-line max-params
  public async postVerifyPurchase(
    domain: string,
    token: string,
    username: string,
    password: string,
    itemsCart: any
  ) {
    const auth = this.getAuthHeader(username, password)
    return this.http.post(
      `https://${domain}/v1/databases/${token}/retail/pos/verify-purchase/v2`,
      JSON.stringify(itemsCart),
      {
        metric: 'postVerifyPurchase',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public async postRegisterPurchase(
    domain: string,
    token: string,
    username: string,
    password: string,
    itemsCart: any
  ) {
    const auth = this.getAuthHeader(username, password)

    return this.http.post(
      `https://${domain}/v1/databases/${token}/retail/pos/register-purchase/v2`,
      JSON.stringify(itemsCart),
      {
        metric: 'postRegisterPurchase',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
