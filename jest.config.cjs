module.exports = {
  testEnvironment: "jsdom",
  coverageReporters: ["json-summary", "text"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
