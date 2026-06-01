import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import SuccessBanner from '../ui/SuccessBanner'
import WalletCard from './WalletCard'
import BreakSavingsModal from './BreakSavingsModal'
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
  const [showManageSuccess, setShowManageSuccess] = useState(false)

  const walletToManage = useMemo(
    () => wallets.find((w) => w.id === manageWalletId) ?? null,
    [wallets, manageWalletId]
  )

  const handleWithdraw = (id) => {
    console.info('Withdraw from wallet', id)
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
