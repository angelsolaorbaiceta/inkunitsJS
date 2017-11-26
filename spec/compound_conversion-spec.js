const convert = require('../src/conversion')

describe("Unit Conversion Engine", () =>
{
    it("can convert from mm2 to mm2", () =>
    {
        expect(
            convert(25).from('mm2').to('mm2')
        ).toBe(25)
    })

    it("can convert from cm2 to m2", () =>
    {
        expect(
            convert(25).from("cm2").to("m2")
        ).toBe(0.0025)
    })

    it("can convert from kg/m2 to g/cm2", () =>
    {
        expect(
            convert(25).from("kg/m2").to("g/cm2")
        ).toBe(2.5)
    })
})
