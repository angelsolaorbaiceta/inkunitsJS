import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    name: 'inkunits',
    format: 'umd'
  },
  plugins: [json(), typescript()]
}
