'use client'

export async function enableMocking() {
  if (typeof window === 'undefined') {
    return
  }

  if (process.env.NODE_ENV === 'test' && process.env.NEXT_PUBLIC_API_URL?.includes('api-gateway')) {
    return
  }

  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('../mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
