export function containSameElements<T>(a: T[], b: T[]): boolean {
  if (a.length != b.length) return false

  for (const element of a) {
    if (!b.includes(element)) return false
  }

  return true
}

export function zip<T>(a: T[], b: T[]): T[] {
  if (a.length != b.length) {
    throw new Error(`Expect arrays to have same length`)
  }

  const result = []
  for (var i = 0; i < a.length; i++) {
    result.push([a[i], b[i]])
  }

  return result
}
