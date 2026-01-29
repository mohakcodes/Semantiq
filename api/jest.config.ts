import type {Config} from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
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
        '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },

    moduleFileExtensions: ['ts', 'js', 'json'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'json-summary'],

    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/server.ts'
    ],

    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
    ],

    maxWorkers: '50%',
}

export default config