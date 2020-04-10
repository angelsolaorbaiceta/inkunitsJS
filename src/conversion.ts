import * as factors from './factors.json'
import { expand } from './expansion'
import { containSameElements, zip } from './arrays'
import { UnitInfo, UnitExpansion, UnitExpansionInfo } from './types'
import { compoundConversionFactor } from './factor'

const conversionFactorCache = {}

export function convertQuantityFromTo(
  amount: number,
  srcUnits: string,
  tgtUnits: string
): number {
  const cacheKey = makeCacheKey(srcUnits, tgtUnits)
  if (conversionFactorCache.hasOwnProperty(cacheKey)) {
    return amount * conversionFactorCache[cacheKey]
  }

  const srcUnitsExpansionInfo = makeUnitExpansionInfo(expand(srcUnits))
  const tgtUnitsExpansionInfo = makeUnitExpansionInfo(expand(tgtUnits))
  if (!canConvert(srcUnitsExpansionInfo, tgtUnitsExpansionInfo)) {
    throw new Error(`Cannot convert from ${srcUnits} to ${tgtUnits}`)
  }

  conversionFactorCache[cacheKey] = compoundConversionFactor(
    srcUnitsExpansionInfo,
    tgtUnitsExpansionInfo
  )
  return convertQuantityFromTo(amount, srcUnits, tgtUnits)
}

function makeCacheKey(srcUnits: string, tgtUnits: string) {
  return `${srcUnits}->${tgtUnits}`
}

function makeUnitExpansionInfo(
  unitExpansion: UnitExpansion
): UnitExpansionInfo {
  return {
    numerator: unitExpansion.numerator.map(findInfoForUnit),
    denominator: unitExpansion.denominator.map(findInfoForUnit)
  }
}

function canConvert(
  srcUnitsExpansionInfo: UnitExpansionInfo,
  tgtUnitExpansionInfo: UnitExpansionInfo
): boolean {
  const srcNumeratorGroups = srcUnitsExpansionInfo.numerator.map((i) => i.group)
  const srcDenominatorGroups = srcUnitsExpansionInfo.denominator.map(
    (i) => i.group
  )

  const tgtNumeratorGroups = tgtUnitExpansionInfo.numerator.map((i) => i.group)
  const tgtDenominatorGroups = tgtUnitExpansionInfo.denominator.map(
    (i) => i.group
  )

  return (
    containSameElements(srcNumeratorGroups, tgtNumeratorGroups) &&
    containSameElements(srcDenominatorGroups, tgtDenominatorGroups)
  )
}

function findInfoForUnit(unitName: string): UnitInfo {
  for (const unitGroupName in factors) {
    for (const unitSystem of factors[unitGroupName]['systems']) {
      if (unitSystem['factors'].hasOwnProperty(unitName)) {
        return {
          group: unitGroupName,
          system: unitSystem['name'],
          factor: unitSystem['factors'][unitName]
        }
      }
    }
  }

  throw new Error(`Unit named ${unitName} was not found in configuration`)
}
