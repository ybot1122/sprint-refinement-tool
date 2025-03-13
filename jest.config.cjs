module.exports = {
  testEnvironment: "jsdom",
  coverageReporters: ["json"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
