const convert = require('../src/conversion')

describe("Unit Conversion Engine", () =>
{
    /* Units in the same system */
    it("can convert from centimeters to meters", () =>
    {
        expect(
            convert(250).from('cm').to('m')
        ).toBe(2.5)
    })

    it("can convert from meters to centimeters", () =>
    {
        expect(
            convert(2.5).from('m').to('cm')
        ).toBe(250)
    })

    /* Units in different systems */
    it("can convert from feet to meters", () =>
    {
        expect(
            convert(10).from('ft').to('m')
        ).toBeCloseTo(3.048, 1e-10)
    })

    it("can convert from centimeters to miles", () =>
    {
        expect(
            convert(10).from('cm').to('mi')
        ).toBeCloseTo(3.2808/52800, 1e-10)
    })

    /* Conversion errors */
    it("cannot convert from units it doesn't know", () =>
    {
        expect(() => { convert(10).from('foos').to('m') }).toThrow()
    })

    it("cannot convert to units it doesn't know", () =>
    {
        expect(() => { convert(10).from('cm').to('foos') }).toThrow()
    })

    it("cannot convert units of different systems", () =>
    {
        expect(() => { convert(10).from('cm').to('kg') }).toThrow()
    })
})
