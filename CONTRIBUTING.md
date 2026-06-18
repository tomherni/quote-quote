# Contributing

Thank you for contributing to this project!

## Development

### Node.js version

The Node.js version specified in the `package.json` reflects the minimum version supported by the published library. All code that is shipped must remain compatible with that version.

Contributors are welcome to use newer Node.js versions for development and tooling, provided that the published package will remain compatible with the minimum version. The recommended Node.js version for development is specified in any pipeline YAML.

### Steps for contributing

1. Clone this repository
2. Run `npm ci` to install dev dependencies
3. Make your changes...
4. Run `npm run build` to compile and create a `dist`
5. Run `npm test` to run tests from `dist`
