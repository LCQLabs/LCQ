const nextJest = require('next/jest');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

// Any custom Jest configuration options
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/config/(.*)$': '<rootDir>/config/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  clearMocks: true,
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  // Mock implementations for non-JS modules
  moduleNameMapper: {
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.png$': '<rootDir>/__mocks__/fileMock.js',
    '\\.jpg$': '<rootDir>/__mocks__/fileMock.js',
    '\\.gif$': '<rootDir>/__mocks__/fileMock.js',
  },
  // Path to custom jest transforms
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // Environment setup
  setupFiles: ['<rootDir>/jest.env.js'],
};

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig);