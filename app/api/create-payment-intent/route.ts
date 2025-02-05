import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'mxn',
      payment_method_types: ['card', 'oxxo'],
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Internal Error:', error)
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    )
  }
}
