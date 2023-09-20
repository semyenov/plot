import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      'd3@7.8.5/dist/d3.min.js': ['<rootDir>/node_modules/d3/dist/d3.min.js'],
      '@observablehq/plot': [
        '<rootDir>/node_modules/@observablehq/plot/dist/plot.umd.js',
      ],
      ...compilerOptions.paths,
    }, 
    { useESM: true },
  ),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}

export default jestConfig
