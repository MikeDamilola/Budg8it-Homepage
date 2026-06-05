import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import SuccessBanner from '../ui/SuccessBanner'
import WalletCard from './WalletCard'
import BreakSavingsModal from './BreakSavingsModal'
import WithdrawFundsModal from './WithdrawFundsModal'
import SecurityPinModal from './SecurityPinModal'
import SecurityPinSuccessModal from './SecurityPinSuccessModal'
import TransferSuccessfulModal from './TransferSuccessfulModal'
import { buildReceiptText, createTransferReceipt } from '../../utils/transferReceipt'
import ManageWalletModal from './create-wallet/ManageWalletModal'

const WALLETS = [
  {
    id: 'ds-w1',
    name: 'Expenses Wallet',
    colorTheme: 'navy',
    withdrawableBalance: 12500,
    savingsBalance: 45500,
    matured: false,
    daysToMaturity: 14,
    linkedProductsCount: 0,
    paymentUrl: 'pay.budg8it.com/w/expenses-wallet',
    savingsDuration: '3',
    autoSavePercent: 40,
  },
  {
    id: 'ds-w2',
    name: 'Business Funds',
    colorTheme: 'teal',
    withdrawableBalance: 12500,
    savingsBalance: 45500,
    matured: true,
    daysToMaturity: null,
    linkedProductsCount: 0,
    paymentUrl: 'pay.budg8it.com/w/business-funds',
    savingsDuration: '12',
    autoSavePercent: 40,
  },
  {
    id: 'ds-w3',
    name: 'Weekly Stocks',
    colorTheme: 'olive',
    withdrawableBalance: 12500,
    savingsBalance: 45500,
    matured: false,
    daysToMaturity: 7,
    linkedProductsCount: 12,
    paymentUrl: 'pay.budg8it.com/w/weekly-stocks',
    savingsDuration: '6',
    autoSavePercent: 40,
  },
]

export default function WalletsSection({ onAddWallet }) {
  const [wallets, setWallets] = useState(WALLETS)
  const [breakSavingsWallet, setBreakSavingsWallet] = useState(null)
  const [manageWalletId, setManageWalletId] = useState(null)
  const [withdrawWalletId, setWithdrawWalletId] = useState(null)
  const [withdrawFormData, setWithdrawFormData] = useState(null)
  const [showSecurityPin, setShowSecurityPin] = useState(false)
  const [showSecurityPinSuccess, setShowSecurityPinSuccess] = useState(false)
  const [showTransferSuccess, setShowTransferSuccess] = useState(false)
  const [transferReceipt, setTransferReceipt] = useState(null)
  const [pinSuccessVariant, setPinSuccessVariant] = useState('created')
  const [showManageSuccess, setShowManageSuccess] = useState(false)

  const walletToManage = useMemo(
    () => wallets.find((w) => w.id === manageWalletId) ?? null,
    [wallets, manageWalletId]
  )

  const walletToWithdraw = useMemo(
    () => wallets.find((w) => w.id === withdrawWalletId) ?? null,
    [wallets, withdrawWalletId]
  )

  const handleWithdraw = (id) => {
    setWithdrawWalletId(id)
  }

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
  }

  const handleManageWallet = (id) => {
    setManageWalletId(id)
  }

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

  return (
    <section className="mb-8">
      <SuccessBanner
        message="Changes made successfully"
        visible={showManageSuccess}
        onDismiss={() => setShowManageSuccess(false)}
        className="mb-4"
      />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0F172A]">Your Wallets</h2>
        <button
          type="button"
          onClick={onAddWallet}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
        >
          <Plus size={16} aria-hidden />
          Add Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onWithdraw={handleWithdraw}
            onManageWallet={handleManageWallet}
            onBreakSavings={handleBreakSavings}
          />
        ))}
      </div>

      <ManageWalletModal
        open={manageWalletId !== null}
        wallet={walletToManage}
        onClose={() => setManageWalletId(null)}
        onSave={handleSaveWalletChanges}
      />

      <WithdrawFundsModal
        open={withdrawWalletId !== null}
        wallet={walletToWithdraw}
        onClose={() => setWithdrawWalletId(null)}
        onSave={handleSaveWithdraw}
      />

      <SecurityPinModal
        open={showSecurityPin}
        onClose={closeWithdrawFlow}
        onContinue={handleSecurityPinContinue}
      />

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

      {breakSavingsWallet && (
        <BreakSavingsModal
          wallet={breakSavingsWallet}
          onClose={() => setBreakSavingsWallet(null)}
          onBreakSavings={handleConfirmBreak}
        />
      )}
    </section>
  )
}
