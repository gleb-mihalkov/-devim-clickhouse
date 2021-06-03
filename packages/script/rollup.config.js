import nodePolyfills from 'rollup-plugin-node-polyfills';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typeScript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const getPlugins = () => [
  nodePolyfills(),
  nodeResolve({ browser: true }),
  commonJs(),
  typeScript({ tsconfig: 'tsconfig.json' }),
];

export default [
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.js', format: 'iife' }],
    plugins: getPlugins(),
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.min.js', format: 'iife' }],
    plugins: [...getPlugins(), terser()],
  },
];
