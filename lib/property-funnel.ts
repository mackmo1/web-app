export type ListingType = 'buy' | 'rent'

export type PropertyContext = {
  id: string
  title: string
  location: string
  price: string
  listingType: ListingType
  propertyType?: string
}

export type InquiryType = 'property_interest' | 'favorite_property'

export function buildContactUrl(
  ctx: PropertyContext,
  inquiryType: InquiryType = 'property_interest'
): string {
  const params = new URLSearchParams()

  params.set('inquiryType', inquiryType)
  params.set('propertyId', ctx.id)
  params.set('title', ctx.title)
  params.set('location', ctx.location)
  params.set('listingType', ctx.listingType)
  params.set('price', ctx.price)

  if (ctx.propertyType) {
    params.set('propertyType', ctx.propertyType)
  }

  return `/contact-us?${params.toString()}`
}

