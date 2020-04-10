'use strict';

const factors = require('./factors');
const expander = require('./expansion');
const arrays = require('./arrays');

module.exports = amount => ({
  from: (srcUnits) => ({
    to: (tgtUnits) => convertQuantityFromTo(amount, srcUnits, tgtUnits),
  }),
});

let conversionFactorCache = {};
let makeCacheKey = (srcUnits, tgtUnits) => `${srcUnits}->${tgtUnits}`;

let convertQuantityFromTo = (amount, srcUnits, tgtUnits) => {
  let cacheKey = makeCacheKey(srcUnits, tgtUnits);
  if (conversionFactorCache.hasOwnProperty(cacheKey)) {
    return amount * conversionFactorCache[cacheKey]
  }

  let srcUnitsExpansionInfo = makeUnitExpansionInfo(expander.expand(srcUnits));
  let tgtUnitsExpansionInfo = makeUnitExpansionInfo(expander.expand(tgtUnits));
  if (!canConvert(srcUnitsExpansionInfo, tgtUnitsExpansionInfo)) {
    throw `Cannot convert from ${srcUnits} to ${tgtUnits}`
  }

  conversionFactorCache[cacheKey] = compoundConversionFactor(
    srcUnitsExpansionInfo,
    tgtUnitsExpansionInfo
  );
  return convertQuantityFromTo(amount, srcUnits, tgtUnits)
};

let makeUnitExpansionInfo = unitExpansion => ({
  numerator: unitExpansion.numerator.map(findInfoForUnit),
  denominator: unitExpansion.denominator.map(findInfoForUnit),
});

let canConvert = (srcUnitsExpansionInfo, tgtUnitExpansionInfo) => {
  let srcNumeratorGroups = srcUnitsExpansionInfo.numerator.map((i) => i.group);
  let srcDenominatorGroups = srcUnitsExpansionInfo.denominator.map(
    (i) => i.group
  );

  let tgtNumeratorGroups = tgtUnitExpansionInfo.numerator.map((i) => i.group);
  let tgtDenominatorGroups = tgtUnitExpansionInfo.denominator.map(
    (i) => i.group
  );

  return (
    arrays.containSameElements(srcNumeratorGroups, tgtNumeratorGroups) &&
    arrays.containSameElements(srcDenominatorGroups, tgtDenominatorGroups)
  )
};

let findInfoForUnit = unitName => {
  for (var unitGroupName in factors) {
    for (var unitSystem of factors[unitGroupName]['systems']) {
      if (unitSystem['factors'].hasOwnProperty(unitName)) {
        return {
          group: unitGroupName,
          system: unitSystem['name'],
          factor: unitSystem['factors'][unitName],
        }
      }
    }
  }

  throw `Unit named ${unitName} was not found in configuration`
};

let compoundConversionFactor = (
  srcUnitsExpansionInfo,
  tgtUnitsExpansionInfo
) => {
  let numeratorFactor = conversionFactor(
    srcUnitsExpansionInfo.numerator,
    tgtUnitsExpansionInfo.numerator
  );
  let denominatorFactor = conversionFactor(
    srcUnitsExpansionInfo.denominator,
    tgtUnitsExpansionInfo.denominator
  );

  let numeratorSystemChangeFactor = systemConversionFactor(
    srcUnitsExpansionInfo.numerator,
    tgtUnitsExpansionInfo.numerator
  );
  let denominatorSystemChangeFactor = systemConversionFactor(
    srcUnitsExpansionInfo.denominator,
    tgtUnitsExpansionInfo.denominator
  );

  return (
    (numeratorFactor * numeratorSystemChangeFactor) /
    (denominatorFactor * denominatorSystemChangeFactor)
  )
};

let conversionFactor = (srcUnitsInfoArray, tgtUnitsInfoArray) => {
  let srcFactor = srcUnitsInfoArray.reduce(
    (factor, info) => factor * info.factor,
    1.0
  );
  let tgtFactor = tgtUnitsInfoArray.reduce(
    (factor, info) => factor * info.factor,
    1.0
  );

  return srcFactor / tgtFactor
};

let systemConversionFactor = (srcUnitsInfoArray, tgtUnitsInfoArray) => {
  let factor = 1.0;

  for (unitsInfoTuple of arrays.zip(srcUnitsInfoArray, tgtUnitsInfoArray)) {
    if (unitsInfoTuple[0].system != unitsInfoTuple[1].system) {
      let systemConversionFactors =
        factors[unitsInfoTuple[0].group]['system_conversion_factors'];
      let systemConversionFactor = systemConversionFactors.find(
        (f) =>
          f.from == unitsInfoTuple[0].system && f.to == unitsInfoTuple[1].system
      );

      factor *= systemConversionFactor['factor'];
    }
  }

  return factor
};
