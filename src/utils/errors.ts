interface ApiError {
  response?: {
    data?: {
      message?: string | string[] | { message?: string | string[] };
    };
  };
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  const data = (error as ApiError)?.response?.data;
  let message = data?.message;

  if (message && typeof message === 'object' && !Array.isArray(message)) {
    message = message.message;
  }

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}
