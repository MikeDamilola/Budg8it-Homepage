export function createTransferReceipt() {
  const now = new Date()
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const transactionDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} · ${hours}:${minutes}`
  const transactionId = `WPT-${Math.floor(100000000 + Math.random() * 900000000)}`

  return { transactionId, transactionDate }
}

export function buildReceiptText({ amount, bankName, accountNumber, accountName, transactionId, transactionDate }) {
  const formattedAmount = `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
  return [
    'Budg8it Transfer Receipt',
    '------------------------',
    `Transaction ID: ${transactionId}`,
    `Date: ${transactionDate}`,
    `Amount: ${formattedAmount}`,
    `Bank: ${bankName}`,
    `Account: ${accountNumber}`,
    `Account Name: ${accountName}`,
    '',
    'Secured by WalletPro Vault',
  ].join('\n')
}
