import SlideShow from '../components/auth/SlideShow'
import SignUpForm from '../components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-row">
      <aside className="hidden min-h-screen w-[40%] flex-col items-center justify-center bg-white md:flex">
        <SlideShow />
      </aside>

      <main className="flex min-h-screen w-full flex-col justify-center bg-[#F5F6FA] px-6 py-10 md:w-[60%] md:px-12 md:py-12 lg:px-20">
        <SignUpForm />
      </main>
    </div>
  )
}
