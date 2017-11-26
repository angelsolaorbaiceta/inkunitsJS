const expander = require('../src/expansion')

describe("A Unit Expansion", () =>
{
    it("expands a simple unit", () =>
    {
        let expansion = expander.expand('m')

        expect(expansion.numerator).toEqual(['m'])
        expect(expansion.denominator).toEqual([])
    })

    it("expands a squared unit", () =>
    {
        let expansion = expander.expand('cm2')

        expect(expansion.numerator).toEqual(['cm', 'cm'])
        expect(expansion.denominator).toEqual([])
    })

    it("expands compound unit", () =>
    {
        let expansion = expander.expand('kg·m2')

        expect(expansion.numerator).toEqual(['kg', 'm', 'm'])
        expect(expansion.denominator).toEqual([])
    })

    it("expands compound denominator", () =>
    {
        let expansion = expander.expand('kg/s·m2')

        expect(expansion.numerator).toEqual(['kg'])
        expect(expansion.denominator).toEqual(['s', 'm', 'm'])
    })
})
