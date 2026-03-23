import { redirect } from 'next/navigation'

// /dashboard/billing → canonical URL is /dashboard/earnings
export default function BillingRedirectPage() {
  redirect('/dashboard/earnings')
}
