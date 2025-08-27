const nextJest = require('next/jest')
const createJestConfig = nextJest({
  dir: './',
})
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app*.{js,jsx,ts,tsx}',
    'components*.{js,jsx,ts,tsx}',
    'lib*.{js,jsx,ts,tsx}',
    '!**node_modules.next__tests__*.{js,jsx,ts,tsx}',
    '<rootDir>*.{test,spec}.{js,jsx,ts,tsx}'
  ],
}
module.exports = createJestConfig(customJestConfig)
