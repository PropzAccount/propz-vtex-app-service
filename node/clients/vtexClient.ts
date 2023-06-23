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

  public getSkuAndContext(account: string, referenceId: string) {
    return this.http.get(`https://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=alternateIds_RefId:${referenceId}`, {
      metric: 'getSkuAndContext',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
    })
  }

  public getOrderForm(account: string, orderFormId: string) {
    
    return this.http.get(`https://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}`, {
      metric: "getOrderForm",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
  
  }

  public getOrderFormConfiguration(account: string, appKey: string, appToken: string) {
    
    return this.http.get(`https://${account}.vtexcommercestable.com.br/api/checkout/pvt/configuration/orderForm`, {
      metric: "getOrderFormConfiguration",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  
  }

  // eslint-disable-next-line max-params
  public postOrderFormConfigurationPriceManual(account: string, appKey: string, appToken: string, orderFormConfiguration: any) {
    
    return this.http.post(`https://${account}.vtexcommercestable.com.br/api/checkout/pvt/configuration/orderForm`, JSON.stringify(orderFormConfiguration) , {
      metric: "postOrderFormConfigurationPriceManual",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  }
  
  // eslint-disable-next-line max-params
  public putPrice(account: string, appKey: string, appToken: string, orderFormId: string, itemIndex: string, priceManual: any) {
    return this.http.put(
      `https://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`, 
    JSON.stringify({price: priceManual}), {
      metric: "putPrice",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  }
}