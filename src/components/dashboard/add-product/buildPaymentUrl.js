export function buildPaymentUrl(productName) {
  const slug =
    productName
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'payment-savings-001'

  return `pay.fintrack.com/p/${slug}`
}
