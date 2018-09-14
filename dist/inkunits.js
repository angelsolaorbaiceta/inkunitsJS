(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.units || (g.units = {})).convert = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports.containSameElements = (a, b) =>
{
    if (a.length != b.length) return false
    for (element of a) { if (!b.includes(element)) return false }

    return true
}

module.exports.zip = (a, b) =>
{
    if (a.length != b.length)
    {
        throw `Expect arrays to have same length`
    }

    let result = []
    for (var i = 0; i < a.length; i++)
    {
        result.push([a[i], b[i]])
    }

    return result
}

},{}],2:[function(require,module,exports){
const factors = require('./factors')
const expander = require('./expansion')
const arrays = require('./arrays')

module.exports = (amount) => ({
    'from': (srcUnits) => ({
        'to': (tgtUnits) => convertQuantityFromTo(amount, srcUnits, tgtUnits)
    })
})

let conversionFactorCache = {}
let makeCacheKey = (srcUnits, tgtUnits) => `${srcUnits}->${tgtUnits}`

let convertQuantityFromTo = (amount, srcUnits, tgtUnits) =>
{
    let cacheKey = makeCacheKey(srcUnits, tgtUnits)
    if (conversionFactorCache.hasOwnProperty(cacheKey))
    {
        console.log('cache', conversionFactorCache);
        return amount * conversionFactorCache[cacheKey]
    }

    let srcUnitsExpansionInfo = makeUnitExpansionInfo(expander.expand(srcUnits))
    let tgtUnitsExpansionInfo = makeUnitExpansionInfo(expander.expand(tgtUnits))
    if (!canConvert(srcUnitsExpansionInfo, tgtUnitsExpansionInfo))
    {
        throw `Cannot convert from ${srcUnits} to ${tgtUnits}`
    }

    conversionFactorCache[cacheKey] = compoundConversionFactor(srcUnitsExpansionInfo, tgtUnitsExpansionInfo)
    return convertQuantityFromTo(amount, srcUnits, tgtUnits)
}

let makeUnitExpansionInfo = (unitExpansion) =>
    ({
        'numerator': unitExpansion.numerator.map(findInfoForUnit),
        'denominator': unitExpansion.denominator.map(findInfoForUnit)
    })

let canConvert = (srcUnitsExpansionInfo, tgtUnitExpansionInfo) =>
{
    let srcNumeratorGroups = srcUnitsExpansionInfo.numerator.map(i => i.group)
    let srcDenominatorGroups = srcUnitsExpansionInfo.denominator.map(i => i.group)

    let tgtNumeratorGroups = tgtUnitExpansionInfo.numerator.map(i => i.group)
    let tgtDenominatorGroups = tgtUnitExpansionInfo.denominator.map(i => i.group)

    return arrays.containSameElements(srcNumeratorGroups, tgtNumeratorGroups) &&
        arrays.containSameElements(srcDenominatorGroups, tgtDenominatorGroups)
}

let findInfoForUnit = (unitName) =>
{
    for (var unitGroupName in factors)
    {
        for (var unitSystem of factors[unitGroupName]['systems'])
        {
            if (unitSystem['factors'].hasOwnProperty(unitName))
            {
                return {
                    'group': unitGroupName,
                    'system': unitSystem['name'],
                    'factor': unitSystem['factors'][unitName]
                }
            }
        }
    }

    throw `Unit named ${unitName} was not found in configuration`
}

let compoundConversionFactor = (srcUnitsExpansionInfo, tgtUnitsExpansionInfo) =>
{
    let numeratorFactor = conversionFactor(srcUnitsExpansionInfo.numerator, tgtUnitsExpansionInfo.numerator)
    let denominatorFactor = conversionFactor(srcUnitsExpansionInfo.denominator, tgtUnitsExpansionInfo.denominator)

    let numeratorSystemChangeFactor = systemConversionFactor(srcUnitsExpansionInfo.numerator, tgtUnitsExpansionInfo.numerator)
    let denominatorSystemChangeFactor = systemConversionFactor(srcUnitsExpansionInfo.denominator, tgtUnitsExpansionInfo.denominator)

    return (numeratorFactor * numeratorSystemChangeFactor) / (denominatorFactor * denominatorSystemChangeFactor)
}

let conversionFactor = (srcUnitsInfoArray, tgtUnitsInfoArray) =>
{
    let srcFactor = srcUnitsInfoArray.reduce((factor, info) => factor * info.factor, 1.0)
    let tgtFactor = tgtUnitsInfoArray.reduce((factor, info) => factor * info.factor, 1.0)

    return srcFactor / tgtFactor
}

let systemConversionFactor = (srcUnitsInfoArray, tgtUnitsInfoArray) =>
{
    let factor = 1.0

    for (unitsInfoTuple of arrays.zip(srcUnitsInfoArray, tgtUnitsInfoArray))
    {
        if (unitsInfoTuple[0].system != unitsInfoTuple[1].system)
        {
            let systemConversionFactors = factors[unitsInfoTuple[0].group]['system_conversion_factors']
            let systemConversionFactor = systemConversionFactors.find((f) => f.from == unitsInfoTuple[0].system && f.to == unitsInfoTuple[1].system)

            factor *= systemConversionFactor['factor']
        }
    }

    return factor
}

},{"./arrays":1,"./expansion":3,"./factors":4}],3:[function(require,module,exports){
module.exports.expand = (units, config = {}) =>
{
    let splitComponents = splitUnitComponents(units.replace(/\s/g,''), config)
    return {
        'numerator': flatMap(splitComponents.numerator, expandUnit).reduce(flatten, []),
        'denominator': flatMap(splitComponents.denominator, expandUnit).reduce(flatten, [])
    }
}

let splitUnitComponents = (units, config) =>
{
    let multiplierSeparator = config.multiplierSeparator || '·'
    let dividerSeparator = config.dividerSeparator || '/'

    let splitUnitComponents = units.split(dividerSeparator)
    let numerator = splitUnitComponents[0]
    let denominator = splitUnitComponents.length > 1 ? splitUnitComponents[1] : ""

    return {
        'numerator': numerator.length > 0 ? numerator.split(multiplierSeparator) : [],
        'denominator': denominator.length > 0 ? denominator.split(multiplierSeparator) : []
    }
}

const unitRegex = /[\w]+[\d]*/
const unitNameRegex = /[A-Za-z]+/
const unitExponentRegex = /[0-9]+/

let expandUnit = (unit) =>
{
    if (!unitRegex.test(unit))
    {
        throw `Could not parse unit from ${unit}`
    }

    return Array(
        parseInt(unit.match(unitExponentRegex) || 1)
    ).fill(
        unit.match(unitNameRegex)
    )
}

let flatMap = (array, callBack) => [].concat(...array.map(callBack))
let flatten = (acc, curr) => acc.concat(curr)

},{}],4:[function(require,module,exports){
module.exports={
    "time": {
        "systems": [
            {
                "name": "universal",
                "factors": {
                    "ms": 0.001,
                    "s": 1,
                    "min": 60,
                    "h": 3600,
                    "day": 86400,
                    "week": 604800,
                    "month": 2592000,
                    "year": 31556952
                }
            }
        ]
    },
    "length": {
        "systems": [
            {
                "name": "international",
                "factors": {
                    "mm": 0.001,
                    "cm": 0.01,
                    "dm": 0.1,
                    "m": 1,
                    "dam": 10,
                    "hm": 100,
                    "km": 1000
                }
            },
            {
                "name": "us",
                "factors": {
                    "mi": 5280,
                    "ft": 1,
                    "in": 0.08333
                }
            }
        ],
        "system_conversion_factors": [
            {
                "from": "international",
                "to": "us",
                "factor": 3.2808
            },
            {
                "from": "us",
                "to": "international",
                "factor": 0.3048
            }
        ]
    },
    "angle": {
        "systems": [
            {
                "name": "universal",
                "factors": {
                    "rad": 1,
                    "deg": 0.017453292519943
                }
            }
        ]
    },
    "mass": {
        "systems": [
            {
                "name": "international",
                "factors": {
                    "mg": 0.001,
                    "cg": 0.01,
                    "dg": 0.1,
                    "g": 1,
                    "dag": 10,
                    "hg": 100,
                    "kg": 1000
                }
            },
            {
                "name": "us",
                "factors": {
                    "oz": 1,
                    "lb": 16
                }
            }
        ],
        "system_conversion_factors": [
            {
                "from": "international",
                "to": "us",
                "factor": 0.03527396
            },
            {
                "from": "us",
                "to": "international",
                "factor": 28.349523125
            }
        ]
    },
    "force": {
        "systems": [
            {
                "name": "international",
                "factors": {
                    "N": 1,
                    "kN": 1000,
                    "MN": 1000000
                }
            },
            {
                "name": "us",
                "factors": {
                    "lbf": 1
                }
            }
        ],
        "system_conversion_factors": [
            {
                "from": "international",
                "to": "us",
                "factor": 0.224808943871
            },
            {
                "from": "us",
                "to": "international",
                "factor": 4.4482216
            }
        ]
    }
}

},{}]},{},[2])(2)
});