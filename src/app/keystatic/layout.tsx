import KeystaticApp from './keystatic'
import './admin.css'

export const metadata = {
  title: 'Raina Lab — Edit',
  robots: { index: false, follow: false },
}

export default function Layout() {
  return (
    <div data-keystatic-admin className="min-h-screen">
      <KeystaticApp />
    </div>
  )
}
