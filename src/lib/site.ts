export function normalizeDomain(input: string) {
  const value = input.trim().toLowerCase()
  if (!value) return ''
  try {
    return new URL(value.startsWith('http') ? value : `https://${value}`).hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  }
}

export function siteNameFromDomain(domain: string) {
  const clean = normalizeDomain(domain)
  return clean.split('.')[0]?.replace(/[-_]+/g, ' ') || clean || 'My site'
}
