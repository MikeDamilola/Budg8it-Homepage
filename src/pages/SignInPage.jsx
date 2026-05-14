import SlideShow from '../components/auth/SlideShow'
import LoginForm from '../components/auth/LoginForm'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-row">
      <aside
        className="hidden min-h-screen w-[40%] flex-col items-center justify-center md:flex"
        style={{
          background:
            'linear-gradient(to right, #C8D5F5 0%, #ffffff 50%, #FDF3C8 100%)',
        }}
      >
        <SlideShow />
      </aside>

      <main className="flex min-h-screen w-full flex-col justify-center bg-[#F5F6FA] px-6 py-10 md:w-[60%] md:px-12 md:py-12 lg:px-20">
        <LoginForm />
      </main>
    </div>
  )
}
