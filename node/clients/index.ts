import { IOClients } from '@vtex/api'
import { Checkout } from '@vtex/clients'

import Propz from './propzClient'
import Vtex from './vtexClient'

export class Clients extends IOClients {
  public get Propz() {
    return this.getOrSet('propz', Propz)
  }

  public get Vtex() {
    return this.getOrSet('vtex', Vtex)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }
}
