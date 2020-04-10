import { ExpanderConfig, UnitExpansion } from './types'

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
  const multiplierSeparator = config.multiplierSeparator || '·'
  const dividerSeparator = config.dividerSeparator || '/'

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

function flatMap<T>(array: T[], callBack: (element: T) => T[]): T[] {
  return [].concat(...array.map(callBack))
}

function flatten<T>(acc: T[], curr: T): T[] {
  return acc.concat(curr)
}
