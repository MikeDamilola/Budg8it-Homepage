import { useEffect, useRef, useState } from 'react'
import {
  Eye,
  EyeOff,
  KeyRound,
  Landmark,
  Shield,
  User,
} from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import SuccessBanner from '../components/ui/SuccessBanner'
import UpdatePINModal from '../components/UpdatePINModal'
import LinkBankAccountModal from '../components/LinkBankAccountModal'

const settingsTabs = [
  { id: 'profile', label: 'Profile Information' },
  { id: 'store', label: 'Store Settings' },
  { id: 'security', label: 'Security Settings' },
  { id: 'bank', label: 'Add Bank Account' },
]

const STORE_CATEGORIES = [
  'Fashion',
  'Electronics',
  'Food & Beverages',
  'Health & Beauty',
  'Home & Living',
  'Services',
  'Other',
]

const footerLinks = [
  'Help Center',
  'Privacy Policy',
  'Terms & Conditions',
  '© 2025',
]

const inputClassName =
  'box-border w-full max-w-full min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 transition focus:border-[#1A1F4E] focus:outline-none focus:ring-2 focus:ring-[#1A1F4E]/10'

const selectClassName = `${inputClassName} appearance-none pr-10`

const labelClassName = 'mb-1.5 block text-[13px] font-semibold text-[#0F172A]'

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  )
}

const getPasswordStrength = (password) => {
  if (password.length === 0) return null
  if (password.length < 6) return 'weak'
  if (password.length < 12) return 'medium'
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  return hasUpper && hasNumber && hasSpecial ? 'strong' : 'medium'
}

const strengthConfig = {
  weak: { width: 'w-1/3', color: 'bg-red-400', label: 'Weak' },
  medium: { width: 'w-2/3', color: 'bg-amber-400', label: 'Medium' },
  strong: { width: 'w-full', color: 'bg-green-500', label: 'Strong' },
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function SettingsPage() {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile')

  const [profileData, setProfileData] = useState({
    fullName: 'Moni Roy',
    email: 'moni.roy@example.com',
    phone: '',
    avatar: null,
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const avatarInputRef = useRef(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showUpdatePINModal, setShowUpdatePINModal] = useState(false)

  const [linkedBankAccounts, setLinkedBankAccounts] = useState([
    { id: '1', bankName: 'Chase Premium Savings', lastFour: '1234' },
  ])
  const [showLinkBankModal, setShowLinkBankModal] = useState(false)

  const [storeData, setStoreData] = useState({
    storeName: '',
    description: '',
    category: '',
    slug: '',
    supportEmail: '',
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const showToast = (message) => {
    setSuccessMessage(message)
    setShowSuccessBanner(true)
  }

  const handleAvatarSelect = (file) => {
    if (!file) return
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setProfileData((prev) => ({ ...prev, avatar: file }))
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setProfileData((prev) => ({ ...prev, avatar: null }))
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }

  const validateProfile = () => {
    const nextErrors = {}
    const phoneDigits = profileData.phone.replace(/\D/g, '')

    if (!profileData.fullName || profileData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name must be at least 2 characters'
    }
    if (!profileData.email || !isValidEmail(profileData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }
    if (!phoneDigits || phoneDigits.length < 10) {
      nextErrors.phone = 'Enter a valid phone number (min 10 digits)'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSaveProfile = () => {
    if (!validateProfile()) return
    showToast('Profile updated successfully')
  }

  const validateStore = () => {
    const nextErrors = {}
    if (!storeData.storeName.trim()) nextErrors.storeName = 'Store name is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSaveStore = () => {
    if (!validateStore()) return
    showToast('Store settings saved successfully')
  }

  const validatePassword = () => {
    const nextErrors = {}
    if (!currentPassword) nextErrors.currentPassword = 'Current password is required'
    if (!newPassword || newPassword.length < 12) {
      nextErrors.newPassword = 'New password must be at least 12 characters'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onUpdatePassword = () => {
    setPasswordSuccess('')
    if (!validatePassword()) return
    setPasswordSuccess('Password updated successfully')
    setCurrentPassword('')
    setNewPassword('')
    setErrors({})
  }

  const onUpdatePIN = () => {
    showToast('Security PIN updated successfully')
  }

  const onResetPinViaEmail = () => {
    showToast('PIN reset email sent to your registered email address')
  }

  const onAddBankAccount = (bankData) => {
    const lastFour = bankData.accountNumber.slice(-4)
    setLinkedBankAccounts((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        bankName: `${bankData.bankName} ${bankData.accountType}`,
        lastFour,
      },
    ])
    showToast('Bank account linked successfully')
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const strength = passwordStrength ? strengthConfig[passwordStrength] : null

  const renderProfileTab = () => (
  <div>
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#1A1F4E]">Profile Information</h2>
      <p className="mt-1 text-[13px] text-gray-400">
        Your personal identity and contact info
      </p>
    </div>

    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => avatarInputRef.current?.click()}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-100"
        aria-label="Upload profile image"
      >
        {avatarPreview ? (
          <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-gray-300">
            <User size={32} strokeWidth={1.5} />
          </span>
        )}
      </button>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleAvatarSelect(e.target.files?.[0])}
      />

      <div>
        <p className="text-sm font-semibold text-[#1A1F4E]">Upload Image</p>
        <p className="mt-0.5 text-xs text-gray-400">Recommended 400x400px. JPG or PNG</p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="rounded-lg border border-[#1A1F4E] bg-white px-4 py-2 text-xs font-semibold text-[#1A1F4E] transition hover:bg-gray-50"
          >
            Change
          </button>
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className="text-xs font-medium text-[#EF4444] transition hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClassName}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={profileData.fullName}
            onChange={(e) => {
              setProfileData((prev) => ({ ...prev, fullName: e.target.value }))
              setErrors((prev) => ({ ...prev, fullName: '' }))
            }}
            placeholder="Enter your full name"
            className={inputClassName}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-500" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => {
              setProfileData((prev) => ({ ...prev, email: e.target.value }))
              setErrors((prev) => ({ ...prev, email: '' }))
            }}
            placeholder="Enter your email address"
            className={inputClassName}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="sm:w-1/2">
        <label htmlFor="phone" className={labelClassName}>
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={profileData.phone}
          onChange={(e) => {
            setProfileData((prev) => ({ ...prev, phone: e.target.value }))
            setErrors((prev) => ({ ...prev, phone: '' }))
          }}
          placeholder="Enter your phone number"
          className={inputClassName}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-500" role="alert">
            {errors.phone}
          </p>
        )}
      </div>
    </div>

    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onSaveProfile}
        className="rounded-lg bg-[#1A1F4E] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
      >
        Save Changes
      </button>
    </div>
  </div>
  )

  const renderStoreTab = () => (
  <div>
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#1A1F4E]">Store Settings</h2>
      <p className="mt-1 text-[13px] text-gray-400">
        Manage your business store details
      </p>
    </div>

    <div className="space-y-5">
      <div>
        <label htmlFor="storeName" className={labelClassName}>
          Store Name
        </label>
        <input
          id="storeName"
          type="text"
          value={storeData.storeName}
          onChange={(e) => {
            setStoreData((prev) => ({ ...prev, storeName: e.target.value }))
            setErrors((prev) => ({ ...prev, storeName: '' }))
          }}
          placeholder="Enter your store name"
          className={inputClassName}
        />
        {errors.storeName && (
          <p className="mt-1.5 text-xs text-red-500" role="alert">
            {errors.storeName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="storeDescription" className={labelClassName}>
          Store Description
        </label>
        <textarea
          id="storeDescription"
          rows={4}
          value={storeData.description}
          onChange={(e) =>
            setStoreData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe your store or business"
          className={`${inputClassName} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="storeCategory" className={labelClassName}>
          Store Category
        </label>
        <div className="relative">
          <select
            id="storeCategory"
            value={storeData.category}
            onChange={(e) =>
              setStoreData((prev) => ({ ...prev, category: e.target.value }))
            }
            className={`${selectClassName} ${storeData.category === '' ? 'text-gray-400' : 'text-[#0F172A]'}`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {STORE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown />
        </div>
      </div>

      <div>
        <label htmlFor="storeSlug" className={labelClassName}>
          Store URL
        </label>
        <div className="flex min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white transition focus-within:border-[#1A1F4E] focus-within:ring-2 focus-within:ring-[#1A1F4E]/10">
          <span className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-400 sm:text-sm">
            pay.budg8it.com/store/
          </span>
          <input
            id="storeSlug"
            type="text"
            value={storeData.slug}
            onChange={(e) =>
              setStoreData((prev) => ({
                ...prev,
                slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
              }))
            }
            placeholder="your-store-name"
            className="min-w-0 flex-1 bg-white px-3 py-3 text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="supportEmail" className={labelClassName}>
          Support Email
        </label>
        <input
          id="supportEmail"
          type="email"
          value={storeData.supportEmail}
          onChange={(e) =>
            setStoreData((prev) => ({ ...prev, supportEmail: e.target.value }))
          }
          placeholder="support@yourbusiness.com"
          className={inputClassName}
        />
      </div>
    </div>

    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onSaveStore}
        className="rounded-lg bg-[#1A1F4E] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
      >
        Save Changes
      </button>
    </div>
  </div>
  )

  const renderSecurityTab = () => (
  <div>
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#1A1F4E]">Security Settings</h2>
      <p className="mt-1 text-[13px] text-gray-400">
        Manage your account security PIN and Password
      </p>
    </div>

    <div className="mb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
          <Shield size={20} className="text-slate-500" strokeWidth={1.75} />
        </div>
        <h3 className="text-[15px] font-bold text-[#1A1F4E]">Security PIN Management</h3>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-gray-400">
        Your 6-digit PIN is used for sensitive actions like wire transfers and wallet exports.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setShowUpdatePINModal(true)}
          className="min-w-[160px] rounded-lg bg-[#1A1F4E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#252b5c]"
        >
          Update PIN
        </button>
        <button
          type="button"
          onClick={onResetPinViaEmail}
          className="min-w-[160px] rounded-lg border border-[#1A1F4E] bg-white px-6 py-3 text-sm font-semibold text-[#1A1F4E] transition hover:bg-gray-50"
        >
          Reset via Email
        </button>
      </div>
    </div>

    <hr className="mb-8 border-gray-100" />

    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
          <KeyRound size={20} className="text-slate-500" strokeWidth={1.75} />
        </div>
        <h3 className="text-[15px] font-bold text-[#1A1F4E]">Password Management</h3>
      </div>

      <div className="mt-6 max-w-lg space-y-5">
        <div>
          <label htmlFor="currentPassword" className={labelClassName}>
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setErrors((prev) => ({ ...prev, currentPassword: '' }))
                setPasswordSuccess('')
              }}
              className={`${inputClassName} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-500" role="alert">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className={labelClassName}>
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setErrors((prev) => ({ ...prev, newPassword: '' }))
                setPasswordSuccess('')
              }}
              placeholder="Min. 12 characters"
              className={`${inputClassName} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {strength && (
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                />
              </div>
              <span className="text-xs text-gray-400">{strength.label}</span>
            </div>
          )}
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-500" role="alert">
              {errors.newPassword}
            </p>
          )}
        </div>

        {passwordSuccess && (
          <p className="text-sm font-medium text-green-600" role="status">
            {passwordSuccess}
          </p>
        )}

        <button
          type="button"
          onClick={onUpdatePassword}
          className="rounded-lg bg-[#1A1F4E] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#252b5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F4E]/40"
        >
          Update Password
        </button>
      </div>
    </div>
  </div>
  )

  const renderBankTab = () => (
  <div>
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#1A1F4E]">Add Bank Account</h2>
      <p className="mt-1 text-[13px] text-gray-400">
        Add bank for withdrawal purposes.
      </p>
    </div>

    {linkedBankAccounts.length > 0 && (
      <div className="mb-4 space-y-3">
        {linkedBankAccounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center gap-3 rounded-[10px] border border-gray-200 bg-white p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <Landmark size={20} className="text-[#1A1F4E]/60" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A1F4E]">{account.bankName}</p>
              <p className="text-xs text-gray-400">
                {'•'.repeat(7)} {account.lastFour}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    <button
      type="button"
      onClick={() => setShowLinkBankModal(true)}
      className="flex h-[52px] w-full items-center justify-center rounded-[10px] border-2 border-dashed border-[#CBD5E1] text-sm text-gray-400 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-500"
    >
      Link New Bank Account
    </button>
  </div>
  )

  const tabContent = {
    profile: renderProfileTab(),
    store: renderStoreTab(),
    security: renderSecurityTab(),
    bank: renderBankTab(),
  }

  return (
    <DashboardLayout>
      <SuccessBanner
        message={successMessage}
        visible={showSuccessBanner}
        onDismiss={() => setShowSuccessBanner(false)}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Settings</h1>
        <p className="mt-1 text-[13px] text-gray-400">
          Manage your account preferences and business store details
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav className="w-full shrink-0 lg:w-[260px]">
          <ul className="flex flex-col gap-1">
            {settingsTabs.map((tab) => {
              const isActive = activeSettingsTab === tab.id
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSettingsTab(tab.id)
                      setErrors({})
                      setPasswordSuccess('')
                    }}
                    className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                      isActive
                        ? 'border-l-[3px] border-[#1A1F4E] bg-white font-bold text-[#1A1F4E] shadow-sm'
                        : 'border-l-[3px] border-transparent text-gray-400 hover:bg-gray-100/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="min-h-[480px] min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          {tabContent[activeSettingsTab]}
        </div>
      </div>

      <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 py-6 sm:gap-6">
        {footerLinks.map((item) => (
          <span
            key={item}
            className="cursor-pointer text-xs text-gray-400 transition hover:text-[#0F172A]"
          >
            {item}
          </span>
        ))}
      </footer>

      <UpdatePINModal
        open={showUpdatePINModal}
        onClose={() => setShowUpdatePINModal(false)}
        onUpdatePIN={onUpdatePIN}
      />

      <LinkBankAccountModal
        open={showLinkBankModal}
        onClose={() => setShowLinkBankModal(false)}
        onAddBankAccount={onAddBankAccount}
      />
    </DashboardLayout>
  )
}
