(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.inkunits = {}));
}(this, (function (exports) { 'use strict';

    function containSameElements(a, b) {
        if (a.length != b.length)
            return false;
        for (const element of a) {
            if (!b.includes(element))
                return false;
        }
        return true;
    }
    function zip(a, b) {
        if (a.length != b.length) {
            throw new Error(`Expect arrays to have same length`);
        }
        const result = [];
        for (var i = 0; i < a.length; i++) {
            result.push([a[i], b[i]]);
        }
        return result;
    }

    const DEFAULT_MULTIPLIER_SEPARATOR = '*';
    const DEFAULT_DIVIDER_SEPARATOR = '/';
    function expand(units, config = {}) {
        const splitComponents = splitUnitComponents(units.replace(/\s/g, ''), config);
        const expandedNumerator = flatExpandUnit(splitComponents.numerator);
        const expandedDenominator = flatExpandUnit(splitComponents.denominator);
        return {
            numerator: expandedNumerator.reduce(flatten, []),
            denominator: expandedDenominator.reduce(flatten, [])
        };
    }
    function splitUnitComponents(units, config) {
        const { multiplierSeparator: multSep, dividerSeparator: divSep } = config;
        const multiplierSeparator = multSep || DEFAULT_MULTIPLIER_SEPARATOR;
        const dividerSeparator = divSep || DEFAULT_DIVIDER_SEPARATOR;
        const [numerator, denominator = ''] = units.split(dividerSeparator);
        return {
            numerator: removeEmpty(numerator.split(multiplierSeparator)),
            denominator: removeEmpty(denominator.split(multiplierSeparator))
        };
    }
    function removeEmpty(strings) {
        return strings.filter((str) => str.length > 0);
    }
    function flatExpandUnit(components) {
        return flatMap(components, expandUnit);
    }
    const unitRegex = /[\w]+[\d]*/;
    const unitNameRegex = /[A-Za-z]+/;
    const unitExponentRegex = /[0-9]+/;
    function expandUnit(unit) {
        if (!unitRegex.test(unit)) {
            throw new Error(`Could not parse unit from ${unit}`);
        }
        return Array(unitExponent(unit)).fill(unitName(unit));
    }
    function unitExponent(unit) {
        const unitExponentMatch = unit.match(unitExponentRegex);
        return unitExponentMatch ? parseInt(unit.match(unitExponentRegex)[0]) : 1;
    }
    function unitName(unit) {
        return unit.match(unitNameRegex)[0];
    }
    function flatMap(array, callBack) {
        return [].concat(...array.map(callBack));
    }
    function flatten(acc, curr) {
        return acc.concat(curr);
    }

    var time = {
    	systems: [
    		{
    			name: "universal",
    			factors: {
    				ms: 0.001,
    				s: 1,
    				min: 60,
    				h: 3600,
    				day: 86400,
    				week: 604800,
    				month: 2592000,
    				year: 31556952
    			}
    		}
    	]
    };
    var length = {
    	systems: [
    		{
    			name: "international",
    			factors: {
    				mm: 0.001,
    				cm: 0.01,
    				dm: 0.1,
    				m: 1,
    				dam: 10,
    				hm: 100,
    				km: 1000
    			}
    		},
    		{
    			name: "us",
    			factors: {
    				mi: 5280,
    				ft: 1,
    				"in": 0.08333
    			}
    		}
    	],
    	system_conversion_factors: [
    		{
    			from: "international",
    			to: "us",
    			factor: 3.2808
    		},
    		{
    			from: "us",
    			to: "international",
    			factor: 0.3048
    		}
    	]
    };
    var angle = {
    	systems: [
    		{
    			name: "universal",
    			factors: {
    				rad: 1,
    				deg: 0.017453292519943
    			}
    		}
    	]
    };
    var mass = {
    	systems: [
    		{
    			name: "international",
    			factors: {
    				mg: 0.001,
    				cg: 0.01,
    				dg: 0.1,
    				g: 1,
    				dag: 10,
    				hg: 100,
    				kg: 1000
    			}
    		},
    		{
    			name: "us",
    			factors: {
    				oz: 1,
    				lb: 16
    			}
    		}
    	],
    	system_conversion_factors: [
    		{
    			from: "international",
    			to: "us",
    			factor: 0.03527396
    		},
    		{
    			from: "us",
    			to: "international",
    			factor: 28.349523125
    		}
    	]
    };
    var force = {
    	systems: [
    		{
    			name: "international",
    			factors: {
    				N: 1,
    				kN: 1000,
    				MN: 1000000,
    				GN: 1000000000
    			}
    		},
    		{
    			name: "us",
    			factors: {
    				lbf: 1
    			}
    		}
    	],
    	system_conversion_factors: [
    		{
    			from: "international",
    			to: "us",
    			factor: 0.224808943871
    		},
    		{
    			from: "us",
    			to: "international",
    			factor: 4.4482216
    		}
    	]
    };
    var factors = {
    	time: time,
    	length: length,
    	angle: angle,
    	mass: mass,
    	force: force
    };

    var factors$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        time: time,
        length: length,
        angle: angle,
        mass: mass,
        force: force,
        'default': factors
    });

    function compoundConversionFactor(srcUnitsExpansionInfo, tgtUnitsExpansionInfo) {
        const numeratorFactor = conversionFactor(srcUnitsExpansionInfo.numerator, tgtUnitsExpansionInfo.numerator);
        const denominatorFactor = conversionFactor(srcUnitsExpansionInfo.denominator, tgtUnitsExpansionInfo.denominator);
        const numeratorSystemChangeFactor = systemConversionFactor(srcUnitsExpansionInfo.numerator, tgtUnitsExpansionInfo.numerator);
        const denominatorSystemChangeFactor = systemConversionFactor(srcUnitsExpansionInfo.denominator, tgtUnitsExpansionInfo.denominator);
        return ((numeratorFactor * numeratorSystemChangeFactor) /
            (denominatorFactor * denominatorSystemChangeFactor));
    }
    function conversionFactor(srcUnitsInfoArray, tgtUnitsInfoArray) {
        let srcFactor = srcUnitsInfoArray.reduce((factor, info) => factor * info.factor, 1.0);
        let tgtFactor = tgtUnitsInfoArray.reduce((factor, info) => factor * info.factor, 1.0);
        return srcFactor / tgtFactor;
    }
    function systemConversionFactor(srcUnitsInfoArray, tgtUnitsInfoArray) {
        let factor = 1.0;
        for (const unitsInfoTuple of zip(srcUnitsInfoArray, tgtUnitsInfoArray)) {
            if (unitsInfoTuple[0].system != unitsInfoTuple[1].system) {
                let systemConversionFactors = factors$1[unitsInfoTuple[0].group]['system_conversion_factors'];
                let systemConversionFactor = systemConversionFactors.find((f) => f.from == unitsInfoTuple[0].system && f.to == unitsInfoTuple[1].system);
                factor *= systemConversionFactor['factor'];
            }
        }
        return factor;
    }

    const conversionFactorCache = {};
    function convertQuantityFromTo(amount, srcUnits, tgtUnits) {
        const cacheKey = makeCacheKey(srcUnits, tgtUnits);
        if (conversionFactorCache.hasOwnProperty(cacheKey)) {
            return amount * conversionFactorCache[cacheKey];
        }
        const srcUnitsExpansionInfo = makeUnitExpansionInfo(expand(srcUnits));
        const tgtUnitsExpansionInfo = makeUnitExpansionInfo(expand(tgtUnits));
        if (!canConvert(srcUnitsExpansionInfo, tgtUnitsExpansionInfo)) {
            throw new Error(`Cannot convert from ${srcUnits} to ${tgtUnits}`);
        }
        conversionFactorCache[cacheKey] = compoundConversionFactor(srcUnitsExpansionInfo, tgtUnitsExpansionInfo);
        return convertQuantityFromTo(amount, srcUnits, tgtUnits);
    }
    function makeCacheKey(srcUnits, tgtUnits) {
        return `${srcUnits}->${tgtUnits}`;
    }
    function makeUnitExpansionInfo(unitExpansion) {
        return {
            numerator: unitExpansion.numerator.map(findInfoForUnit),
            denominator: unitExpansion.denominator.map(findInfoForUnit)
        };
    }
    function canConvert(srcUnitsExpansionInfo, tgtUnitExpansionInfo) {
        const srcNumeratorGroups = srcUnitsExpansionInfo.numerator.map((i) => i.group);
        const srcDenominatorGroups = srcUnitsExpansionInfo.denominator.map((i) => i.group);
        const tgtNumeratorGroups = tgtUnitExpansionInfo.numerator.map((i) => i.group);
        const tgtDenominatorGroups = tgtUnitExpansionInfo.denominator.map((i) => i.group);
        return (containSameElements(srcNumeratorGroups, tgtNumeratorGroups) &&
            containSameElements(srcDenominatorGroups, tgtDenominatorGroups));
    }
    function findInfoForUnit(unitName) {
        for (const unitGroupName in factors$1) {
            for (const unitSystem of factors$1[unitGroupName]['systems']) {
                if (unitSystem['factors'].hasOwnProperty(unitName)) {
                    return {
                        group: unitGroupName,
                        system: unitSystem['name'],
                        factor: unitSystem['factors'][unitName]
                    };
                }
            }
        }
        throw new Error(`Unit named ${unitName} was not found in configuration`);
    }

    function convert(amount) {
        return {
            from: (srcUnits) => ({
                to: (tgtUnits) => convertQuantityFromTo(amount, srcUnits, tgtUnits)
            })
        };
    }

    exports.convert = convert;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
