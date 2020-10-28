import { containSameElements } from './arrays'
import { expand } from './expansion'
import { compoundConversionFactor } from './factor'
import * as factors from './factors.json'
import { UnitExpansion, UnitExpansionInfo, UnitInfo } from './types'

const conversionFactorCache = new Map<string, number>()

export function convertQuantityFromTo(
  amount: number,
  srcUnits: string,
  tgtUnits: string
): number {
  const cacheKey = makeCacheKey(srcUnits, tgtUnits)
  if (conversionFactorCache.has(cacheKey)) {
    return amount * conversionFactorCache.get(cacheKey)
  }

  const srcUnitsExpansionInfo = makeUnitExpansionInfo(expand(srcUnits))
  const tgtUnitsExpansionInfo = makeUnitExpansionInfo(expand(tgtUnits))
  if (!canConvert(srcUnitsExpansionInfo, tgtUnitsExpansionInfo)) {
    throw new Error(`Cannot convert from ${srcUnits} to ${tgtUnits}`)
  }

  conversionFactorCache.set(
    cacheKey,
    compoundConversionFactor(srcUnitsExpansionInfo, tgtUnitsExpansionInfo)
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
