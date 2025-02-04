// app/payment/page.tsx

'use client'

import { useState } from 'react'

export default function ConektaPaymentPage() {
  const [email, setEmail] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expMonth, setExpMonth] = useState('')
  const [expYear, setExpYear] = useState('')
  const [cvc, setCvc] = useState('')
  const [amount, setAmount] = useState('')

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!(window as any).Conekta) {
      alert('La librería de Conekta no se ha cargado.')
      return
    }

    const conekta = (window as any).Conekta
    conekta.setPublicKey(process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY)

    conekta.Token.create(
      {
        card: {
          number: cardNumber,
          name: email,
          exp_month: expMonth,
          exp_year: expYear,
          cvc,
        },
      },
      async (token: { id: string }) => {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token.id, email, amount }),
        })
        const data = await response.json()
        alert(data.message || data.error)
      },
      (error: any) => alert(error.message)
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>
          Pagar con Conekta
        </h1>
        <form onSubmit={handlePayment} className='space-y-4'>
          <div>
            <label htmlFor='email' className='block text-gray-700 mb-1'>
              Correo electrónico
            </label>
            <input
              id='email'
              type='email'
              placeholder='Correo electrónico'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline'
            />
          </div>

          <div>
            <label htmlFor='cardNumber' className='block text-gray-700 mb-1'>
              Número de tarjeta
            </label>
            <input
              id='cardNumber'
              type='text'
              placeholder='Número de tarjeta'
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline'
            />
          </div>

          <div className='flex space-x-4'>
            <div className='w-1/2'>
              <label htmlFor='expMonth' className='block text-gray-700 mb-1'>
                Mes (MM)
              </label>
              <input
                id='expMonth'
                type='text'
                placeholder='MM'
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                required
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline'
              />
            </div>
            <div className='w-1/2'>
              <label htmlFor='expYear' className='block text-gray-700 mb-1'>
                Año (YY)
              </label>
              <input
                id='expYear'
                type='text'
                placeholder='YY'
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                required
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline'
              />
            </div>
          </div>

          <div>
            <label htmlFor='cvc' className='block text-gray-700 mb-1'>
              CVC
            </label>
            <input
              id='cvc'
              type='text'
              placeholder='CVC'
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline'
            />
          </div>

          <div>
            <label htmlFor='amount' className='block text-gray-700 mb-1'>
              Monto en MXN
            </label>
            <input
              id='amount'
              type='number'
              placeholder='Monto en MXN'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Pagar
          </button>
        </form>
      </div>
    </div>
  )
}
