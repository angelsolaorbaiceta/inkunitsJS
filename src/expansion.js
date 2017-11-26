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
