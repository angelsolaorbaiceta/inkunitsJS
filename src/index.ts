import { convertQuantityFromTo } from './conversion'

export function convert(amount: number) {
  return {
    from: (srcUnits: string) => ({
      to: (tgtUnits: string) =>
        convertQuantityFromTo(amount, srcUnits, tgtUnits)
    })
  }
}
