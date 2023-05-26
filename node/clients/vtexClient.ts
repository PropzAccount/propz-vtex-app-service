/* eslint-disable prettier/prettier */
import type { InstanceOptions, IOContext} from '@vtex/api';
import { JanusClient } from '@vtex/api'

export default class Vtex extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      retries: 2,
    })
  }

  public getSkuAndContext(account: string, skuId: string) {
    return this.http.get(`https://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=skuId:${skuId}`, {
      metric: 'getSkuAndContext',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
    })
  }

  // eslint-disable-next-line max-params
  public getSkuPrice(account: string, appKey: string, appToken: string, skuId: string) {
    
    return this.http.get(`https://api.vtex.com/${account}/pricing/prices/${skuId}`, {
      metric: "getSkuPrice",
      headers: {
        'Content-Type': 'application/json',
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  }
  
  // eslint-disable-next-line max-params
  public putPrice(account: string, orderFormId: string, itemIndex: number, discount: number) {
    return this.http.put(
      `https://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`, 
    JSON.stringify({price: discount}), {
      metric: "putPrice",
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
}
