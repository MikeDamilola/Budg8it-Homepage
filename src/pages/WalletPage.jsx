import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link2, Plus, Search } from 'lucide-react'
import SuccessBanner from '../components/ui/SuccessBanner'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import WalletCard from '../components/dashboard/WalletCard'
import BreakSavingsModal from '../components/dashboard/BreakSavingsModal'
import WithdrawFundsModal from '../components/dashboard/WithdrawFundsModal'
import SecurityPinModal from '../components/dashboard/SecurityPinModal'
import SecurityPinSuccessModal from '../components/dashboard/SecurityPinSuccessModal'
import TransferSuccessfulModal from '../components/dashboard/TransferSuccessfulModal'
import { buildReceiptText, createTransferReceipt } from '../utils/transferReceipt'
import CreateNewWallet from '../components/dashboard/create-wallet/CreateNewWallet'
import ManageWalletModal from '../components/dashboard/create-wallet/ManageWalletModal'
import WalletCreatedSuccess from '../components/dashboard/create-wallet/WalletCreatedSuccess'
import bankWImg from '../assets/Bank.png'
import walletWImg from '../assets/Wallet.png'
import autosavingsWImg from '../assets/Autosavings.svg'
import bankIconImg from '../assets/Bank Icon.svg'
import walletIconImg from '../assets/Wallet Icon.svg'
import autosavingsIconImg from '../assets/Autosavings Icon.svg'

const formatNaira = (amount) =>
  `₦${Number(amount ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`

const MOCK_WALLETS = [
  {
    id: 'w1',
    name: 'Withdrawal Wallet',
    colorTheme: 'navy',
    withdrawableBalance: 45500,
    savingsBalance: 5500,
    matured: false,
    daysToMaturity: 14,
    linkedProductsCount: 12,
    paymentUrl: 'pay.budg8it.com/w/withdrawal-wallet-001',
    savingsDuration: '6',
    autoSavePercent: 40,
  },
  {
    id: 'w2',
    name: 'Business Savings',
    colorTheme: 'teal',
    withdrawableBalance: 45500,
    savingsBalance: 5500,
    matured: true,
    daysToMaturity: null,
    linkedProductsCount: 12,
    paymentUrl: 'pay.budg8it.com/w/withdrawal-wallet-002',
  },
  {
    id: 'w3',
    name: 'Emergency Fund',
    colorTheme: 'olive',
    withdrawableBalance: 45500,
    savingsBalance: 5500,
    matured: false,
    daysToMaturity: 14,
    linkedProductsCount: 12,
    paymentUrl: 'pay.budg8it.com/w/withdrawal-wallet-003',
  },
  {
    id: 'w4',
    name: 'Withdrawal Wallet',
    colorTheme: 'navy',
    withdrawableBalance: 45500,
    savingsBalance: 5500,
    matured: false,
    daysToMaturity: 14,
    linkedProductsCount: 0,
    paymentUrl: 'pay.budg8it.com/w/unlinked-001',
  },
  {
    id: 'w5',
    name: 'Spare Wallet',
    colorTheme: 'teal',
    withdrawableBalance: 45500,
    savingsBalance: 5500,
    matured: true,
    daysToMaturity: null,
    linkedProductsCount: 0,
    paymentUrl: 'pay.budg8it.com/w/unlinked-002',
  },
  {
    id: 'w6',
    name: 'Holiday Fund',
    colorTheme: 'olive',
    withdrawableBalance: 45500,
    savingsBalance: 5500,
    matured: false,
    daysToMaturity: 14,
    linkedProductsCount: 0,
    paymentUrl: 'pay.budg8it.com/w/unlinked-003',
  },
]

const footerLinks = [
  'Help Center',
  'Privacy Policy',
  'Terms & Conditions',
  '© 2025',
]

export default function WalletPage() {
  const navigate = useNavigate()
  const [wallets, setWallets] = useState(MOCK_WALLETS)
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [walletSuccessData, setWalletSuccessData] = useState(null)
  const [manageWalletId, setManageWalletId] = useState(null)
  const [withdrawWalletId, setWithdrawWalletId] = useState(null)
  const [withdrawFormData, setWithdrawFormData] = useState(null)
  const [showSecurityPin, setShowSecurityPin] = useState(false)
  const [showSecurityPinSuccess, setShowSecurityPinSuccess] = useState(false)
  const [showTransferSuccess, setShowTransferSuccess] = useState(false)
  const [transferReceipt, setTransferReceipt] = useState(null)
  const [pinSuccessVariant, setPinSuccessVariant] = useState('created')
  const [showManageSuccess, setShowManageSuccess] = useState(false)
  const [breakSavingsWallet, setBreakSavingsWallet] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const linkedWallets = useMemo(
    () => wallets.filter((w) =>
      w.linkedProductsCount > 0 &&
      w.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [wallets, searchQuery]
  )
  const unlinkedWallets = useMemo(
    () => wallets.filter((w) =>
      w.linkedProductsCount === 0 &&
      w.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [wallets, searchQuery]
  )

  // Aggregate stats
  const totalDeposits = useMemo(
    () => wallets.reduce((sum, w) => sum + w.withdrawableBalance + w.savingsBalance, 0),
    [wallets]
  )
  const totalWithdrawable = useMemo(
    () => wallets.reduce((sum, w) => sum + w.withdrawableBalance, 0),
    [wallets]
  )
  const totalSavings = useMemo(
    () => wallets.reduce((sum, w) => sum + w.savingsBalance, 0),
    [wallets]
  )

  const handleWithdraw = (id) => {
    setWithdrawWalletId(id)
  }

  const walletToWithdraw = useMemo(
    () => wallets.find((w) => w.id === withdrawWalletId) ?? null,
    [wallets, withdrawWalletId]
  )

  const handleSaveWithdraw = (data) => {
    setWithdrawFormData(data)
    setWithdrawWalletId(null)
    setShowSecurityPin(true)
  }

  const openTransferSuccess = () => {
    setShowSecurityPin(false)
    setShowSecurityPinSuccess(false)
    setTransferReceipt(createTransferReceipt())
    setShowTransferSuccess(true)
  }

  const handleSecurityPinContinue = ({ action }) => {
    if (action === 'verified') {
      openTransferSuccess()
      return
    }

    setShowSecurityPin(false)
    setPinSuccessVariant(action === 'reset' ? 'reset' : 'created')
    setShowSecurityPinSuccess(true)
  }

  const closeWithdrawFlow = () => {
    setWithdrawWalletId(null)
    setWithdrawFormData(null)
    setShowSecurityPin(false)
    setShowSecurityPinSuccess(false)
    setShowTransferSuccess(false)
    setTransferReceipt(null)
    setPinSuccessVariant('created')
  }

  const handleVerifyWithdraw = () => {
    openTransferSuccess()
  }

  const handleTransferSuccessBackToDashboard = () => {
    closeWithdrawFlow()
    navigate('/dashboard')
  }

  const handleDownloadReceipt = () => {
    if (!withdrawFormData || !transferReceipt) return

    const receiptText = buildReceiptText({
      ...withdrawFormData,
      ...transferReceipt,
    })
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${transferReceipt.transactionId}-receipt.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleBackToDashboard = () => {
    closeWithdrawFlow()
    navigate('/dashboard')
  }

  const handleManageWallet = (id) => {
    setManageWalletId(id)
  }

  const walletToManage = useMemo(
    () => wallets.find((w) => w.id === manageWalletId) ?? null,
    [wallets, manageWalletId]
  )

  const handleSaveWalletChanges = (data) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.id === data.walletId
          ? {
              ...w,
              savingsDuration: data.savingsDuration,
              autoSavePercent: data.autoSavePercent,
              linkedProductsCount: data.linkProducts
                ? (w.linkedProductsCount > 0 ? w.linkedProductsCount : 1)
                : 0,
            }
          : w
      )
    )
    setManageWalletId(null)
    setShowManageSuccess(true)
  }

  const handleBreakSavings = (id) => {
    const wallet = wallets.find((w) => w.id === id)
    if (wallet) setBreakSavingsWallet(wallet)
  }

  const handleConfirmBreak = (id) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, savingsBalance: 0, matured: false } : w
      )
    )
    setBreakSavingsWallet(null)
  }

  const handleWalletCreated = (data) => {
    setShowCreateWallet(false)
    setWalletSuccessData(data)
  }

  return (
    <DashboardLayout>
      <SuccessBanner
        message="Changes made successfully"
        visible={showManageSuccess}
        onDismiss={() => setShowManageSuccess(false)}
        className="mb-5"
      />

      {/* ── Page header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Wallet</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your money across different wallets
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateWallet(true)}
          className="flex w-50 cursor-pointer items-center gap-3 rounded-xl bg-[#1A1F4E] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Plus width={16} height={16} className="h-4 w-4 object-contain brightness-0 invert" aria-hidden />
          </span>
          Add Wallet
        </button>
      </div>

      {/* ── Wallet search bar ── */}
      <div className="mb-6 flex w-full max-w-md items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <Search size={16} className="shrink-0 text-gray-400" aria-hidden />
        <input
          type="search"
          placeholder="Search wallets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-gray-400"
          aria-label="Search wallets"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="shrink-0 text-xs text-gray-400 transition hover:text-[#0F172A]"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Section 1: Summary stats ── */}
      <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total Deposits */}
        <div className="relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-2xl bg-[#1A1F4E] p-5">
          {/* Watermark */}
          <img
            src={bankWImg}
            alt=""
            className="absolute right-2 top-1/2 h-32 w-32 -translate-y-1/2 object-contain opacity-100"
            aria-hidden
          />
          {/* Badge */}
          <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <img src={bankIconImg} alt="" className="h-5 w-5 object-contain brightness-0 invert" aria-hidden />
          </div>
          {/* Label + amount */}
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-200/60">
              Total Deposits
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {formatNaira(totalDeposits)}
            </p>
          </div>
        </div>

        {/* Withdrawable Balance */}
        <div className="relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-2xl bg-[#0D7A5F] p-5">
          {/* Watermark */}
          <img
            src={walletWImg}
            alt=""
            className="absolute right-2 top-1/2 h-32 w-32 -translate-y-1/2 object-contain opacity-100"
            aria-hidden
          />
          {/* Badge */}
          <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <img src={walletIconImg} alt="" className="h-5 w-5 object-contain brightness-0 invert" aria-hidden />
          </div>
          {/* Label + amount */}
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-200/60">
              With-drawable Balance
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {formatNaira(totalWithdrawable)}
            </p>
          </div>
        </div>

        {/* Total Savings */}
        <div className="relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-2xl bg-[#E8F5F0] p-5">
          {/* Watermark */}
          <img
            src={autosavingsWImg}
            alt=""
            className="absolute right-2 top-1/2 h-32 w-32 -translate-y-1/2 object-contain opacity-30"
            aria-hidden
          />
          {/* Badge */}
          <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-200/50">
            <img src={autosavingsIconImg} alt="" className="h-5 w-5 object-contain brightness-0 invert" aria-hidden />
          </div>
          {/* Label + amount */}
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600/70">
              Total Savings
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0F172A]">
              {formatNaira(totalSavings)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Linked Wallets ── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Link2 size={20} className="text-[#0F172A]" strokeWidth={2} aria-hidden />
          <h2 className="text-lg font-bold text-[#0F172A]">Linked Wallets</h2>
        </div>

        {linkedWallets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {linkedWallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onWithdraw={handleWithdraw}
                onManageWallet={handleManageWallet}
                onBreakSavings={handleBreakSavings}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white">
            <p className="text-sm text-gray-400">No linked wallets yet</p>
          </div>
        )}
      </div>

      {/* ── Section 3: Unlinked Wallets ── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Link2 size={20} className="text-[#0F172A]" strokeWidth={2} aria-hidden />
          <h2 className="text-lg font-bold text-[#0F172A]">Unlinked Wallets</h2>
        </div>

        {unlinkedWallets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unlinkedWallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onWithdraw={handleWithdraw}
                onManageWallet={handleManageWallet}
                onBreakSavings={handleBreakSavings}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white">
            <p className="text-sm text-gray-400">No unlinked wallets</p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-2 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 py-6 sm:gap-6">
        {footerLinks.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="cursor-pointer text-xs text-gray-400 transition hover:text-[#0F172A]"
          >
            {item}
          </span>
        ))}
      </footer>

      {/* ── Create Wallet Modal ── */}
      <CreateNewWallet
        open={showCreateWallet}
        onClose={() => setShowCreateWallet(false)}
        onCreateWallet={handleWalletCreated}
      />

      {/* ── Wallet Created Success Modal ── */}
      <WalletCreatedSuccess
        open={!!walletSuccessData}
        walletName={walletSuccessData?.walletName ?? ''}
        linkedProducts={
          walletSuccessData?.linkedProducts?.isExisting &&
          walletSuccessData?.linkedProductData?.productName
            ? [
                {
                  id: walletSuccessData.linkedProductData.productId ?? 'new',
                  name: walletSuccessData.linkedProductData.productName,
                },
              ]
            : []
        }
        onDone={() => setWalletSuccessData(null)}
      />

      {/* ── Manage Wallet Modal ── */}
      <ManageWalletModal
        open={manageWalletId !== null}
        wallet={walletToManage}
        onClose={() => setManageWalletId(null)}
        onSave={handleSaveWalletChanges}
      />

      {/* ── Withdraw Funds Modal ── */}
      <WithdrawFundsModal
        open={withdrawWalletId !== null}
        wallet={walletToWithdraw}
        onClose={() => setWithdrawWalletId(null)}
        onSave={handleSaveWithdraw}
      />

      {/* ── Security PIN Modal ── */}
      <SecurityPinModal
        open={showSecurityPin}
        onClose={closeWithdrawFlow}
        onContinue={handleSecurityPinContinue}
      />

      {/* ── Security PIN Success Modal ── */}
      <SecurityPinSuccessModal
        open={showSecurityPinSuccess}
        variant={pinSuccessVariant}
        onVerifyWithdraw={handleVerifyWithdraw}
        onBackToDashboard={handleBackToDashboard}
      />

      <TransferSuccessfulModal
        open={showTransferSuccess}
        amount={withdrawFormData?.amount}
        bankName={withdrawFormData?.bankName}
        accountNumber={withdrawFormData?.accountNumber}
        transactionId={transferReceipt?.transactionId}
        transactionDate={transferReceipt?.transactionDate}
        onBackToDashboard={handleTransferSuccessBackToDashboard}
        onDownloadReceipt={handleDownloadReceipt}
      />

      {/* ── Break Savings Modal ── */}
      {breakSavingsWallet && (
        <BreakSavingsModal
          wallet={breakSavingsWallet}
          onClose={() => setBreakSavingsWallet(null)}
          onBreakSavings={handleConfirmBreak}
        />
      )}
    </DashboardLayout>
  )
}
