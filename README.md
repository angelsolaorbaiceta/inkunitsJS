# InkUnits
Smart unit conversion engine.

# Usage Node
Load module:
```javascript
const convert = require('inkunits')
```
Then use the fluent API:
```javascript
convert(45).from('N/cm2').to('lbf/ft2')
```
Catching errors:
```javascript
try {
    convert(45).from('N').to('ft')
} catch(error) {
    console.log(error)
}
```
The code above would print to the console the following error message:
> Cannot convert from N to ft

# Usage Browser
Include the _dist/inkunits.js_ file:
```javascript
<script src="dist/inkunits.js"></script>
```
Which loads the code under _units.convert_ namespace:
```javascript
try {
    const result = units.convert(amount).from(sourceUnits).to(targetUnits);
    console.log(`result: ${result.toFixed(5)} ${targetUnits}`);
} catch(error) {
    console.log(`ERROR: ${error}`);
}
```
