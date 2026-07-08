type Handler = () => void

const logoutHandlers = new Set<Handler>()

export const authEvents = {
  emitLogout(): void {
    logoutHandlers.forEach((handler) => handler())
  },
  onLogout(handler: Handler): () => void {
    logoutHandlers.add(handler)
    return () => {
      logoutHandlers.delete(handler)
    }
  },
}
