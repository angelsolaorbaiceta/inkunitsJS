import { flatMap, flatten } from './arrays'
import { ExpanderConfig, UnitExpansion } from './types'

const DEFAULT_MULTIPLIER_SEPARATOR = '*'
const DEFAULT_DIVIDER_SEPARATOR = '/'

export function expand(
  units: string,
  config: ExpanderConfig = {}
): UnitExpansion {
  const splitComponents = splitUnitComponents(units.replace(/\s/g, ''), config)
  const expandedNumerator = flatExpandUnit(splitComponents.numerator)
  const expandedDenominator = flatExpandUnit(splitComponents.denominator)

  return {
    numerator: expandedNumerator.reduce(flatten, []),
    denominator: expandedDenominator.reduce(flatten, [])
  }
}

function splitUnitComponents(
  units: string,
  config: ExpanderConfig
): UnitExpansion {
  const { multiplierSeparator: multSep, dividerSeparator: divSep } = config
  const multiplierSeparator = multSep || DEFAULT_MULTIPLIER_SEPARATOR
  const dividerSeparator = divSep || DEFAULT_DIVIDER_SEPARATOR

  const [numerator, denominator = ''] = units.split(dividerSeparator)

  return {
    numerator: removeEmpty(numerator.split(multiplierSeparator)),
    denominator: removeEmpty(denominator.split(multiplierSeparator))
  }
}

function removeEmpty(strings: string[]): string[] {
  return strings.filter((str) => str.length > 0)
}

function flatExpandUnit(components: string[]): string[] {
  return flatMap(components, expandUnit)
}

const unitRegex = /[\w]+[\d]*/
const unitNameRegex = /[A-Za-z]+/
const unitExponentRegex = /[0-9]+/

function expandUnit(unit: string): string[] {
  if (!unitRegex.test(unit)) {
    throw new Error(`Could not parse unit from ${unit}`)
  }

  return Array(unitExponent(unit)).fill(unitName(unit))
}

function unitExponent(unit: string): number {
  const unitExponentMatch = unit.match(unitExponentRegex)
  return unitExponentMatch ? parseInt(unit.match(unitExponentRegex)[0]) : 1
}

function unitName(unit: string): string {
  return unit.match(unitNameRegex)[0]
}
