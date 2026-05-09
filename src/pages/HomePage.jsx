import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import HeroSection from '../components/HeroSection.jsx'
import ValueProp from '../components/ValueProp.jsx'
import CoreFeatures from '../components/CoreFeatures.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import FAQSection from '../components/FAQSection.jsx'
import Footer from '../components/Footer.jsx'
import WaitlistModal from '../components/WaitlistModal.jsx'

export default function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false)
  const handleOpenModal = () => setModalOpen(true)

  return (
    <div className="bg-white antialiased">
      <Navbar onOpenModal={handleOpenModal} />
      <main>
        <HeroSection onOpenModal={handleOpenModal} />
        <ValueProp />
        <CoreFeatures />
        <HowItWorks />
        <FAQSection />
        <Footer onOpenModal={handleOpenModal} />
      </main>
      <WaitlistModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
