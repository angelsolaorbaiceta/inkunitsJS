import * as factors from './factors.json'
import { UnitExpansionInfo, UnitInfo } from './types'
import { zip } from './arrays'

export function compoundConversionFactor(
  srcUnitsExpansionInfo: UnitExpansionInfo,
  tgtUnitsExpansionInfo: UnitExpansionInfo
): number {
  const numeratorFactor = conversionFactor(
    srcUnitsExpansionInfo.numerator,
    tgtUnitsExpansionInfo.numerator
  )
  const denominatorFactor = conversionFactor(
    srcUnitsExpansionInfo.denominator,
    tgtUnitsExpansionInfo.denominator
  )

  const numeratorSystemChangeFactor = systemConversionFactor(
    srcUnitsExpansionInfo.numerator,
    tgtUnitsExpansionInfo.numerator
  )
  const denominatorSystemChangeFactor = systemConversionFactor(
    srcUnitsExpansionInfo.denominator,
    tgtUnitsExpansionInfo.denominator
  )

  return (
    (numeratorFactor * numeratorSystemChangeFactor) /
    (denominatorFactor * denominatorSystemChangeFactor)
  )
}

function conversionFactor(srcUnitsInfoArray, tgtUnitsInfoArray): number {
  let srcFactor = srcUnitsInfoArray.reduce(
    (factor, info) => factor * info.factor,
    1.0
  )
  let tgtFactor = tgtUnitsInfoArray.reduce(
    (factor, info) => factor * info.factor,
    1.0
  )

  return srcFactor / tgtFactor
}

function systemConversionFactor(
  srcUnitsInfoArray: UnitInfo[],
  tgtUnitsInfoArray: UnitInfo[]
): number {
  let factor = 1.0

  for (const unitsInfoTuple of zip(srcUnitsInfoArray, tgtUnitsInfoArray)) {
    if (unitsInfoTuple[0].system != unitsInfoTuple[1].system) {
      let systemConversionFactors =
        factors[unitsInfoTuple[0].group]['system_conversion_factors']
      let systemConversionFactor = systemConversionFactors.find(
        (f) =>
          f.from == unitsInfoTuple[0].system && f.to == unitsInfoTuple[1].system
      )

      factor *= systemConversionFactor['factor']
    }
  }

  return factor
}
