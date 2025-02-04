// app/api/payment/route.ts

import { NextResponse } from 'next/server'
import conekta from 'conekta'

conekta.api_key = process.env.CONEKTA_PRIVATE_KEY || ''
conekta.api_version = process.env.CONEKTA_API_VERSION || '2.1.0'

export async function POST(request: Request) {
  const body = await request.json()
  const { token, email, amount } = body

  if (!token || !email || !amount) {
    return NextResponse.json(
      { error: 'Faltan datos requeridos' },
      { status: 400 }
    )
  }

  try {
    // Conekta utiliza callbacks, por lo que lo encapsulamos en una Promise.
    const order = await new Promise((resolve, reject) => {
      conekta.Order.create(
        {
          currency: 'MXN',
          customer_info: { email },
          line_items: [
            {
              name: 'Producto de prueba',
              unit_price: Number(amount) * 100,
              quantity: 1,
            },
          ],
          charges: [{ payment_method: { type: 'card', token_id: token } }],
        },
        (order: any) => resolve(order),
        (error: any) => reject(error)
      )
    })

    return NextResponse.json(
      { message: 'Pago exitoso', order },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.details ? error.details[0].message : 'Error en el pago' },
      { status: 500 }
    )
  }
}
