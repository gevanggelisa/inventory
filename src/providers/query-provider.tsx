"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") {
        const { server } = await import("@/msw/server")
        server.listen()
      } else {
        const { worker } = await import("@/msw/browser")
        await worker.start({
          onUnhandledRequest: "bypass",
        })
      }

      setReady(true)
    }

    init()
  }, [])

  if (!ready) return null

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}
