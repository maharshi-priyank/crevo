import { Resend } from 'resend'
import { getEnv } from '@creator-os/config'

let _resend: Resend | undefined

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(getEnv().RESEND_API_KEY)
  }
  return _resend
}
