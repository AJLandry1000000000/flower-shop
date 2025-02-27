export default {
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    testEnvironment: "node",
    // extensionsToTreatAsEsm: [".js"],
    globals: {
        "ts-jest": {
        useESM: true
        }
    },
    moduleFileExtensions: ["js", "json", "jsx", "node"]
};