interface AccessTokenClaims {
  sub?: string
  userId?: string
  email?: string
  exp?: number
}

export function readAccessTokenClaims(
  token: string,
): AccessTokenClaims {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      '=',
    )

    const bytes = Uint8Array.from(
      atob(padded),
      (character) => character.charCodeAt(0),
    )

    const json = new TextDecoder().decode(bytes)

    return JSON.parse(json) as AccessTokenClaims
  } catch {
    throw new Error('Unable to read access token claims')
  }
}
