export interface Items {
  active: boolean
  promotion: {
    active: boolean
    mechanic: string
    discountAmount: number
    discountPercent: number
    finalPrice: number
    promotionType: string
    minQuantity: number
    properties: {
      PRODUCT_ID_INCLUSION: string
    }
  }
  remainingMaxPerCustomer: number
}

// export interface MechanicProps {
//   active: bollean,
//   aggregateId1: null,
//   aggregateId2: null,
//   aggregateId3: null,
//   aggregateId4: null,
//   allocationFlow: 'MANUAL',
//   barcode: null,
//   barcodeImageUrl: null,
//   campaignName: null,
//   database: {
//     href: '/v1/databases/605c6ae5-d10b-48cf-b52b-c635e9cd7563',
//     uuid: '605c6ae5-d10b-48cf-b52b-c635e9cd7563'
//   },
//   dateCreated: '2023-06-05T18:49:00.000Z',
//   dateModified: '2023-06-05T18:49:00.000Z',
//   description: 'genuine teste 3',
//   discountAmount: null,
//   discountPercent: 10,
//   endDate: '2023-11-30T03:01:00.000Z',
//   finalPrice: null,
//   finalPriceListA: null,
//   finalPriceListB: null,
//   freeDelivery: null,
//   group: null,
//   href: '/v1/databases/605c6ae5-d10b-48cf-b52b-c635e9cd7563/retail/promotions/a2af4e61-03d1-11ee-b988-0ef177c8e849',
//   layout: null,
//   legalPersonOnly: false,
//   legalText: 'Oferta válida enquanto durarem os estoques do lote promocional',
//   maxPerCustomer: -1,
//   mechanic: 'percent_off',
//   minAmount: 1,
//   minQuantity: 1,
//   minQuantityListA: 0,
//   minQuantityListB: 0,
//   name: null,
//   originalPrice: null,
//   originalPriceListA: null,
//   originalPriceListB: null,
//   partnerPromotionId: 'S-0000000005',
//   productIdsListA: null,
//   productIdsListB: null,
//   promotionId: 'S-0000000005',
//   promotionType: 'PERSONALIZED',
//   properties: {
//     REQUIRES_REGISTRATION_COMPLETE: '0',
//     PRODUCT_ID_INCLUSION: '49951,25696,88827,60049'
//   },
//   remainingRedeemQuantity: 0,
//   requiresActivation: false,
//   requiresIdentification: true,
//   requiresRegisterComplete: false,
//   startDate: '2023-06-01T03:00:00.000Z',
//   startRedeemQuantity: 0,
//   stores: null,
//   urlImage1: null,
//   urlImage2: null,
//   urlImage3: null,
//   urlImage4: null,
//   urlImage5: null,
//   urlLink1: null,
//   urlLink2: null,
//   urlLink3: null,
//   urlLink4: null,
//   urlLink5: null,
//   uuid: 'a2af4e61-03d1-11ee-b988-0ef177c8e849'
// }
