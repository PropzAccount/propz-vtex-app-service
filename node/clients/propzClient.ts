/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line prettier/prettier
import type { IOContext, InstanceOptions} from '@vtex/api';
import { ExternalClient } from '@vtex/api'
import btoa from 'btoa'

export default class PropzClient extends ExternalClient {
  
  constructor(context: IOContext, options?: InstanceOptions) {
    super("", context, {
      ...options,
      retries: 2,
    })
  }

  public async checkFields(fields: any[]) {
    try {
      return fields.every(field => field !== undefined && field !== '' && field != null);
    } catch (err ) {
      return { error: err }
    }
  }

  private getAuthHeader(username: string, password: string) {
    return `Basic ${btoa(`${username}:${password}`)}`;
  }

  // eslint-disable-next-line max-params
  public async getPromotion(
    domain: string,
    token: string,
    document: number,
    username: string,
    password: string
  ) {
    const auth = this.getAuthHeader(username, password);

    return this.http.get(
      `https://${domain}/v1/databases/${token}/retail/user-promotions/${document}?channel=ecom`,
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
  public async getPromotionMassive( domain: string,
    token: string,
    document: number,
    username: string,
    password: string
    ) {
      const auth = this.getAuthHeader(username, password);

      return this.http.get(
        `https://${domain}/v1/databases/${token}/retail/user-massive-promotions/${document}?channel=ecom`,
        {
          metric: 'getPromotionMassive',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )
  }

  // eslint-disable-next-line max-params
  public async postVerifyPurchase(domain: string, token: string, username: string, password: string, itemsCart: any) {
      const auth = this.getAuthHeader(username, password);

      return this.http.postRaw(
        `https://${domain}/v1/databases/${token}/retail/pos/verify-purchase/v2`, JSON.stringify(itemsCart) ,{
            metric: 'postVerifyPurchase',
            headers: {
              Authorization: auth,
              'Content-Type': 'application/json',
            },
      })
  }

  // eslint-disable-next-line max-params
  public async postRegisterPurchase(domain: string, token: string, username: string, password: string, itemsCart: any) {
    const auth = this.getAuthHeader(username, password);

      return this.http.post(
        `http://${domain}/v1/databases/${token}/retail/pos/register-purchase/v2`, JSON.stringify(itemsCart), {
          headers: {
            metric: 'postRegisterPurchase',
            headers: {
              Authorization: auth,
              'Content-Type': 'application/json',
            },
          }
      })
  }
}
