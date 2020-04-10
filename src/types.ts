export interface UnitInfo {
  group: string
  system: string
  factor: number
}

export interface ExpanderConfig {
  multiplierSeparator?: string
  dividerSeparator?: string
}

export interface UnitExpansion {
  numerator: string[]
  denominator: string[]
}

export interface UnitExpansionInfo {
  numerator: UnitInfo[]
  denominator: UnitInfo[]
}
