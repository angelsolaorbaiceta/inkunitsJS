import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    name: 'inkunits',
    format: 'umd'
  },
  plugins: [json(), typescript(), terser()]
}
