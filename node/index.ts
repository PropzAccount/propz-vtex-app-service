// node/index.ts
import type {
  ServiceContext,
  ParamsContext,
  RecorderState} from '@vtex/api';
import {
  LRUCache,
  Service,
  method,
} from '@vtex/api'

import { Clients } from './clients'
import {
  getPromotion,
  getFormUrl,
  getPromotionJson,
  getProductList,
  postPromotion,
  teste
} from './handlers/propz'

// import { updateLiveUsers } from './event/liveUsersUpdate'

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const TREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: 10000,
      },
      events: {
        exponentialTimeoutCoefficient: 2,
        exponentialBackoffCoefficient: 2,
        initialBackoffDelay: 50,
        retries: 1,
        timeout: TREE_SECONDS_MS,
        concurrency: CONCURRENCY,
      },
    },
  },
  routes: {
    /**
         * ?document=45100809809
         * Body:
         { 
            "firstName": { 
                "value": "Robert", 
                "type": "STRING" 
            },
            "lastName": {
                "value": "Smith",
                "type": "STRING"
            },
            "mobilePhone": {
                "value": "+55011999999999",
                "type": "STRING"
            },
            "height": { 
                "value": 180, 
                "type": "INTEGER" 
            }, 
            "dateOfBirth": { 
                "value": "1978-08-11T14:00:00.000Z",
                "type": "DATE" 
            },  
            "aboutMe": { 
                "value": "About me text", 
                "type": "TEXT" 
            }
        }
         */

    /**
     * body:
     *   {
     *       "customerId":"45100809809"
     *   }
     */
    getPromotion: method({
      GET: [getPromotion],
    }),
    /**
        {
            "sessionId":"SESSÃO DO CLIENTE?",
            "customer":{
                "customerId":"DOCUMENTO"
            },
            "ticket":{
                "ticketId":"ID DO PEDIDO",
                "amount": TOTAL DO PEDIDO,
                "date":"2019-03-15T11:33:23.801Z",
                "blockUpdate":0,
                "items":[
                    {
                        "itemId":"POSIÇÃO NO CARRINHO",
                        "ean":"4455",
                        "unitPrice":10.99,
                        "unitSize":"Unit",
                        "quantity":3,
                        "blockUpdate":0
                    },
                    {
                        "itemId":"2",
                        "ean":"4456",
                        "unitPrice":8.33,
                        "unitSize":"Kg",
                        "quantity":1.00,
                        "blockUpdate":1
                    },
                    {
                        "itemId":"3",
                        "ean":"4457",
                        "unitPrice":4.83,
                        "unitSize":"Kg",
                        "quantity":3,
                        "blockUpdate":0
                    }
                ]
            }
        }

         */

    /**
        {
            "sessionId":"SESSÃO DO CLIENTE?",
            "customer":{
                "customerId":"DOCUMENTO"
            },
            "ticket":{
                "ticketId":"ID DO PEDIDO",
                "amount": TOTAL DO PEDIDO,
                "date":"2019-03-15T11:33:23.801Z",
                "blockUpdate":0,
                "items":[
                    {
                        "itemId":"POSIÇÃO NO CARRINHO",
                        "ean":"4455",
                        "unitPrice":10.99,
                        "unitSize":"Unit",
                        "quantity":3,
                        "blockUpdate":0
                    },
                    {
                        "itemId":"2",
                        "ean":"4456",
                        "unitPrice":8.33,
                        "unitSize":"Kg",
                        "quantity":1.00,
                        "blockUpdate":1
                    },
                    {
                        "itemId":"3",
                        "ean":"4457",
                        "unitPrice":4.83,
                        "unitSize":"Kg",
                        "quantity":3,
                        "blockUpdate":0
                    }
                ]
            }
        }

         */
  
    getFormUrl: method({
      GET: [getFormUrl],
    }),
    getPromotionJson: method({
      GET: [getPromotionJson],
    }),
    getProductList: method({
      GET: [getProductList],
    }),
    postPromotion: method({
      POST: [postPromotion],
    }),
    test: method({
      GET: [teste],
    }),
  },
})
