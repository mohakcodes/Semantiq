import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  setupFiles: ['<rootDir>/jest.setup.ts'],

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts',
  ],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  moduleFileExtensions: ['ts', 'js', 'json'],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/server.ts',
  ],

  coverageThreshold: {
    global: {
      statements: 85,
      branches: 60,
      functions: 80,
      lines: 85,
    },
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],

  maxWorkers: '50%',
}

export default config