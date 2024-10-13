export default {
  // roots: ["<rootDir>/src"],
  
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/assetsMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    'main.jsx',
    'config.js',
    'app/App.jsx',
    'app.routes/App.routes.jsx',
    'hooks/use.films.js',
    'hooks/use.users.js',
    'redux/films.slice.js',
    'redux/users.slice.js',
  ],
};
