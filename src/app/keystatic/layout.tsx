import KeystaticApp from './keystatic'
import './admin.css'

export const metadata = {
  title: 'Raina Lab — Editorial',
  robots: { index: false, follow: false },
}

export default function Layout() {
  return (
    <div data-keystatic-admin>
      <KeystaticApp />
    </div>
  )
}
