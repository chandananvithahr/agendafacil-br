'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type CancelBookingButtonProps = {
  bookingId: string
}

export default function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function cancelBooking() {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Nao foi possivel cancelar.')
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={cancelBooking}
        disabled={loading}
        className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-50 disabled:opacity-60"
      >
        {loading ? 'Cancelando...' : 'Cancelar'}
      </button>
      {error && <p className="max-w-48 text-xs font-bold leading-5 text-rose-700">{error}</p>}
    </div>
  )
}
