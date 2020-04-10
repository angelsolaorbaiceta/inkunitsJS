import { convertQuantityFromTo } from './conversion'

export default function (amount: number) {
  return {
    from: (srcUnits: string) => ({
      to: (tgtUnits: string) =>
        convertQuantityFromTo(amount, srcUnits, tgtUnits)
    })
  }
}