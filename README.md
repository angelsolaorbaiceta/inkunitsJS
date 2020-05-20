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


