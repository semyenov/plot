import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'

import pkg from './package.json' assert { type: 'json' }

const input = 'src/index.ts'
const moduleName = pkg.name.replace(/^@.*\//, '')
const external = Object.keys(pkg.dependencies)
const author = pkg.author
const banner = `/**
  * @license
  * author: ${author}
  * ${moduleName} v${pkg.version}
  * Released under the ${pkg.license} license.
  */`

export default defineConfig([
  {
    input,
    external,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        banner,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        banner,
      },
    ],
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      esbuild({
        tsconfig: './tsconfig.build.json',
        minify: true,
      }),
    ],
  },
  {
    input,
    external,
    output: [
      {
        file: pkg.types,
        format: 'esm',
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      dts({
        tsconfig: './tsconfig.build.json',
        respectExternal: true,
      }),
    ],
  },
])
