// module.exports = {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['@testing-library/jest-dom'],
//   moduleNameMapper: {
//     '\\.(css|less|scss)$': 'identity-obj-proxy',
//     '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
//   },
//   transform: {
//     '^.+\\.[jt]sx?$': 'babel-jest',
//   },
// };


// module.exports = {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['@testing-library/jest-dom'],
//   moduleNameMapper: {
//     '\\.(css|less|scss)$': 'identity-obj-proxy',
//     '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
//   },
//   transform: {
//     '^.+\\.[jt]sx?$': 'babel-jest',
//   },
// };

module.exports = {
  testEnvironment: 'jsdom',
  // setupFilesAfterFramework: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  // testPathPattern: ['<rootDir>/src/__tests__'],
};