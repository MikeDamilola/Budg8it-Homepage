import product1 from '../assets/Product1.png'
import product2 from '../assets/Product2.png'
import product3 from '../assets/Product3.png'

export const DATE_RANGE_OPTIONS = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'this_year', label: 'This Year' },
  { value: 'custom_range', label: 'Custom Range' },
]

export const monthlyData = [
  { period: 'Jan', revenue: 100000 },
  { period: 'Feb', revenue: 55000 },
  { period: 'Mar', revenue: 200000 },
  { period: 'Apr', revenue: 70000 },
  { period: 'May', revenue: 55000 },
  { period: 'Jun', revenue: 200000 },
  { period: 'Jul', revenue: 110000 },
  { period: 'Aug', revenue: 20000 },
  { period: 'Sep', revenue: 65000 },
  { period: 'Oct', revenue: 650000 },
  { period: 'Nov', revenue: 240000 },
  { period: 'Dec', revenue: 150000 },
]

export const dailyData = [
  { period: 'Mon', revenue: 42000 },
  { period: 'Tue', revenue: 68000 },
  { period: 'Wed', revenue: 35000 },
  { period: 'Thu', revenue: 91000 },
  { period: 'Fri', revenue: 450000 },
  { period: 'Sat', revenue: 78000 },
  { period: 'Sun', revenue: 52000 },
]

export const weeklyData = [
  { period: 'W1', revenue: 185000 },
  { period: 'W2', revenue: 92000 },
  { period: 'W3', revenue: 310000 },
  { period: 'W4', revenue: 145000 },
  { period: 'W5', revenue: 76000 },
  { period: 'W6', revenue: 420000 },
  { period: 'W7', revenue: 198000 },
  { period: 'W8', revenue: 133000 },
]

export const yearlyData = [
  { period: '2021', revenue: 1200000 },
  { period: '2022', revenue: 1850000 },
  { period: '2023', revenue: 2400000 },
  { period: '2024', revenue: 3100000 },
  { period: '2025', revenue: 2750000 },
  { period: '2026', revenue: 980000 },
]

export const topProducts = [
  {
    id: '1',
    name: 'SpeedMax Pro X',
    image: product1,
    unitsSold: 10,
    revenue: 12500,
    inventoryStatus: 'in_stock',
  },
  {
    id: '2',
    name: 'Aura Smart Watch',
    image: product2,
    unitsSold: 10,
    revenue: 12500,
    inventoryStatus: 'low_stock',
  },
  {
    id: '3',
    name: 'Acoustics Wireless',
    image: product3,
    unitsSold: 10,
    revenue: 12500,
    inventoryStatus: 'in_stock',
  },
]

export const analyticsByDateRange = {
  last_7_days: {
    totalRevenue: 12500,
    totalSavings: 8200,
    withdrawableBalance: 18,
    transactions: 12500,
    activeWallets: 6,
    products: 24,
    paymentLinks: 9,
    highestRevenueDay: 'Friday, 12th oct',
    highestRevenueAmount: 450000,
    avgTransactionValue: 1041.67,
    salesCount: 12,
    revenueGrowthPercent: 8,
  },
  last_30_days: {
    totalRevenue: 45500,
    totalSavings: 45500,
    withdrawableBalance: 127,
    transactions: 45500,
    activeWallets: 8,
    products: 24,
    paymentLinks: 12,
    highestRevenueDay: 'Friday, 12th oct',
    highestRevenueAmount: 450000,
    avgTransactionValue: 12500,
    salesCount: 12,
    revenueGrowthPercent: 12,
  },
  last_3_months: {
    totalRevenue: 128400,
    totalSavings: 98200,
    withdrawableBalance: 127,
    transactions: 128400,
    activeWallets: 8,
    products: 24,
    paymentLinks: 12,
    highestRevenueDay: 'Friday, 12th oct',
    highestRevenueAmount: 450000,
    avgTransactionValue: 14200,
    salesCount: 36,
    revenueGrowthPercent: 15,
  },
  last_6_months: {
    totalRevenue: 245800,
    totalSavings: 176500,
    withdrawableBalance: 127,
    transactions: 245800,
    activeWallets: 9,
    products: 24,
    paymentLinks: 14,
    highestRevenueDay: 'Friday, 12th oct',
    highestRevenueAmount: 450000,
    avgTransactionValue: 15800,
    salesCount: 68,
    revenueGrowthPercent: 18,
  },
  this_year: {
    totalRevenue: 980000,
    totalSavings: 620000,
    withdrawableBalance: 127,
    transactions: 980000,
    activeWallets: 10,
    products: 24,
    paymentLinks: 16,
    highestRevenueDay: 'Friday, 12th oct',
    highestRevenueAmount: 450000,
    avgTransactionValue: 18200,
    salesCount: 142,
    revenueGrowthPercent: 22,
  },
  custom_range: {
    totalRevenue: 67200,
    totalSavings: 44100,
    withdrawableBalance: 127,
    transactions: 67200,
    activeWallets: 7,
    products: 24,
    paymentLinks: 11,
    highestRevenueDay: 'Friday, 12th oct',
    highestRevenueAmount: 450000,
    avgTransactionValue: 11200,
    salesCount: 18,
    revenueGrowthPercent: 10,
  },
}

export function generateCSVFromData(analyticsData, dateRangeLabel) {
  const rows = [
    ['Budg8it Analytics Report', dateRangeLabel],
    [],
    ['Metric', 'Value'],
    ['Total Revenue', analyticsData.totalRevenue],
    ['Total Savings', analyticsData.totalSavings],
    ['Withdrawable Balance', analyticsData.withdrawableBalance],
    ['Transactions', analyticsData.transactions],
    ['Active Wallets', analyticsData.activeWallets],
    ['Products', analyticsData.products],
    ['Payment Links', analyticsData.paymentLinks],
    ['Highest Revenue Day', analyticsData.highestRevenueDay],
    ['Highest Revenue Amount', analyticsData.highestRevenueAmount],
    ['Avg Transaction Value', analyticsData.avgTransactionValue],
    ['Sales Count', analyticsData.salesCount],
    ['Revenue Growth %', analyticsData.revenueGrowthPercent],
  ]

  return rows.map((row) => row.join(',')).join('\n')
}
