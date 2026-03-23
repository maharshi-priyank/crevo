import Razorpay from 'razorpay'
import { getEnv } from '@creator-os/config'

let _razorpay: Razorpay | undefined

/**
 * Singleton Razorpay SDK instance.
 * Requirement 4.1: Razorpay order creation in paise.
 */
export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    const env = getEnv()
    _razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  }
  return _razorpay
}
