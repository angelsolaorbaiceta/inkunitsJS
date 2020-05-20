# InkUnits
Smart unit conversion engine written in TypeScript.

**InkUnits** can understand compound units and figure out the right conversion factor. 

# Usage Node
Import the conversion function:

```ts
import convert from 'inkunits'
```

Then use the fluent API:

```ts
convert(45).from('N/cm2').to('lbf/ft2')
```


To account for possible conversion errors between incompatible units:

```ts
try {
    convert(45).from('N').to('ft')
} catch(error: Error) {
    console.log(error.message)
}
```
The code above would print to the console the following error message:
> Cannot convert from N to ft

# Unit Conversion Factors

The conversion factors are configured in [src/factors.json](src/factors.json).
These factors are given in groups. 
_Time_, _length_ or _force_ are examples of groups.

Each group in the `factors.json` file follow the following format:

```json
"<group_name>": {
    "systems": [
        ...
    ],
    "system_conversion_factors": [
      {
        "from": "international",
        "to": "us",
        "factor": ...
      },
      {
        "from": "us",
        "to": "international",
        "factor": ...
      }
    ]
}
```

Each group can define conversion factors for different unit systems.
`InkUnits` works with three unit systems:

- International (_m_, _cm_, _N_, _kg_...)
- US Customary (_ft_, _in_, _lbf_...)
- Universal

The _universal_ system of units is used when a particular unit group is used regardless of the system. 
For example, angles are given in _radians_ both in the International and US systems.

The `"system_conversion_factors"` provides the factors required to convert units from one system to another and viceversa.

## Factors

Each system has the following structure for the conversion factors:

```json
{
    "name": "<system_name>",
    "factors": {
        ...
    }
}
```

Every unit system's factors must include a **reference unit** which factor is 1.
