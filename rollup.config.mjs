import dts from 'rollup-plugin-dts';
import { string } from "rollup-plugin-string";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: './dist',
      format: 'cjs'
    },
    plugins: [
      typescript({
        tsconfig: 'tsconfig.build.json',
      }),
      nodeResolve({
        browser: false,
      }),
      string({
        // Import all .pem files as strings
        include: "**/*.pem",
      }),
    ]
  },

  {
    input: './dist/index.d.ts',
    output: [{ file: './dist/index.d.ts', format: 'cjs' }],
    plugins: [dts()],
    external: ['crypto']
  },
];
