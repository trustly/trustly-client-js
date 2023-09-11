import dts from 'rollup-plugin-dts';

export default [
  {
    input: './dist/src/index.d.ts',
    output: [{ file: './dist/src/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
