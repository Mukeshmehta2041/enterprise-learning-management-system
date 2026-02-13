type ClientTelemetryContext = {
  feature: string
  action: string
  metadata?: Record<string, unknown>
}

export function logClientError(context: ClientTelemetryContext, error: unknown) {
  const payload = {
    ...context,
    errorMessage: error instanceof Error ? error.message : String(error),
    errorCode: (error as { code?: string }).code,
    status: (error as { status?: number }).status,
  }

  // Minimal telemetry: structured console output for correlation during debugging.
  console.warn('client.telemetry', payload)
}
