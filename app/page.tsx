import Link from 'next/link'

export default function Home() {
  return (
    <>
      <h1>Payment Mehtods</h1>
      <Link href={'/stripe'}>Stripe</Link>
    </>
  )
}
