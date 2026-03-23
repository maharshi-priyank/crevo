import { getResend } from '../lib/resend.js'
import { getEnv } from '@creator-os/config'

export interface DeliveryEmailInput {
  to: string
  buyerName: string
  productTitle: string
  creatorName: string
  deliveryUrl: string
  downloadsRemaining: number
}

export async function sendDeliveryEmail(input: DeliveryEmailInput) {
  const resend = getResend()
  const env = getEnv()

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: `Your purchase is ready: ${input.productTitle}`,
    html: buildDeliveryEmailHtml(input),
  })

  if (error) {
    throw Object.assign(new Error(`Resend error: ${error.message}`), { code: 'EMAIL_FAILED' })
  }
}

function buildDeliveryEmailHtml(input: DeliveryEmailInput): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0e0e10;padding:28px 40px;text-align:center;">
              <span style="color:#a8a4ff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">crevo</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0e0e10;letter-spacing:-0.5px;">
                Your download is ready! 🎉
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
                Hi ${input.buyerName}, thank you for purchasing
                <strong style="color:#0e0e10;">${input.productTitle}</strong>
                from ${input.creatorName}.
              </p>

              <!-- Download CTA -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;">
                <tr>
                  <td align="center">
                    <a href="${input.deliveryUrl}"
                       style="display:inline-block;background:#a8a4ff;color:#0e0e10;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:-0.2px;">
                      Download Your Product
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notes -->
              <table cellpadding="0" cellspacing="0" width="100%" style="background:#f8f8ff;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-size:13px;color:#555;">
                      ⏱ Link expires in <strong>24 hours</strong>
                    </p>
                    <p style="margin:0;font-size:13px;color:#555;">
                      📥 Downloads remaining: <strong>${input.downloadsRemaining}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                If you have any issues, reply to this email and we'll help you out.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaa;">
                Powered by <a href="https://crevo.in" style="color:#a8a4ff;text-decoration:none;">Crevo</a> —
                India's creator store platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
