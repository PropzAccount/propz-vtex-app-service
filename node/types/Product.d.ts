export interface Product {
  productId: string
  productName: string
  brand: string
  brandId: number
  brandImageUrl: null
  linkText: string
  productReference: string
  productReferenceCode: string
  categoryId: string
  productTitle: string
  metaTagDescription: string
  releaseDate: string
  clusterHighlights: {
    [key: string]: string
  }
  productClusters: {
    [key: string]: string
  }
  searchableClusters: {
    [key: string]: string
  }
  categories: string[]
  categoriesIds: string[]
  link: string
  [key: string]: string[]
  CARACTERÍSTICAS: string[]
  allSpecifications: string[]
  allSpecificationsGroups: string[]
  description: string
  items: [
    {
      itemId: string
      name: string
      nameComplete: string
      complementName: string
      ean: string
      referenceId: [
        {
          Key: string
          Value: string
        }
      ]
      measurementUnit: string
      unitMultiplier: number
      modalType: null
      isKit: boolean
      images: [
        {
          imageId: string
          imageLabel: string
          imageTag: string
          imageUrl: string
          imageText: string
          imageLastModified: string
        }
      ]
      sellers: [
        {
          sellerId: string
          sellerName: string
          addToCartLink: string
          sellerDefault: boolean
          commertialOffer: {
            DeliverySlaSamplesPerRegion: {
              [key: string]: {
                DeliverySlaPerTypes: []
                Region: null
              }
            }
            Installments: [
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              },
              {
                Value: number
                InterestRate: number
                TotalValuePlusInterestRate: number
                NumberOfInstallments: number
                PaymentSystemName: string
                PaymentSystemGroupName: string
                Name: string
              }
            ]
            DiscountHighLight: []
            GiftSkuIds: []
            Teasers: []
            BuyTogether: []
            ItemMetadataAttachment: []
            Price: number
            ListPrice: number
            PriceWithoutDiscount: number
            RewardValue: number
            PriceValidUntil: string
            AvailableQuantity: number
            IsAvailable: boolean
            Tax: number
            DeliverySlaSamples: [
              {
                DeliverySlaPerTypes: []
                Region: null
              }
            ]
            GetInfoErrorMessage: null
            CacheVersionUsedToCallCheckout: string
            PaymentOptions: {
              installmentOptions: [
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                },
                {
                  paymentSystem: string
                  bin: null
                  paymentName: string
                  paymentGroupName: string
                  value: number
                  installments: [
                    {
                      count: number
                      hasInterestRate: boolean
                      interestRate: number
                      value: number
                      total: number
                      sellerMerchantInstallments: [
                        {
                          id: string
                          count: number
                          hasInterestRate: boolean
                          interestRate: number
                          value: number
                          total: number
                        }
                      ]
                    }
                  ]
                }
              ]
              paymentSystems: [
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: boolean
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: true
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: true
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: true
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: true
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: true
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: true
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: boolean
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                },
                {
                  id: number
                  name: string
                  groupName: string
                  validator: null
                  stringId: string
                  template: string
                  requiresDocument: boolean
                  isCustom: boolean
                  description: null
                  requiresAuthentication: boolean
                  dueDate: string
                  availablePayments: null
                }
              ]
              payments: []
              giftCards: []
              giftCardMessages: []
              availableAccounts: []
              availableTokens: []
            }
          }
        }
      ]
      Videos: []
      estimatedDateArrival: null
    }
  ]
}
