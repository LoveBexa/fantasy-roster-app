/** Supabase PostgREST errors are plain objects, not `instanceof Error`. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message
  if (err && typeof err === "object" && "message" in err) {
    const message = (err as { message: unknown }).message
    if (typeof message === "string" && message.length > 0) return message
  }
  return fallback
}

export function toError(err: unknown, fallback: string): Error {
  return new Error(getErrorMessage(err, fallback))
}
