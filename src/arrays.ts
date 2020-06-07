export function containSameElements<T>(a: T[], b: T[]): boolean {
  if (a.length != b.length) return false

  for (const element of a) {
    if (!b.includes(element)) return false
  }

  return true
}

export function zip<T>(a: T[], b: T[]): T[] {
  if (a.length != b.length) {
    throw new Error('Arrays should have equal lengths')
  }

  const result = []
  for (var i = 0; i < a.length; i++) {
    result.push([a[i], b[i]])
  }

  return result
}

export function flatMap<T>(array: T[], callBack: (element: T) => T[]): T[] {
  return [].concat(...array.map(callBack))
}

export function flatten<T>(acc: T[], curr: T): T[] {
  return acc.concat(curr)
}
