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
