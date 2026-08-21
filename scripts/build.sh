#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Prepare the `dist` directory.
DIST_DIR="$ROOT/dist"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Build for CJS and ESM.
# Regarding comments in declaration files: https://github.com/microsoft/TypeScript/issues/14619#issuecomment-1971477006
for MODULE_TYPE in esm cjs; do
  echo "BUILD: building for ${MODULE_TYPE}"
  tsc -p "tsconfig.${MODULE_TYPE}.json" --removeComments && tsc -p "tsconfig.${MODULE_TYPE}.json" --declaration --emitDeclarationOnly
done

# Add a package.json for CJS that sets the type to `commonjs`.
echo "{\"type\":\"commonjs\"}" > "$DIST_DIR/cjs/package.json"

# Run terser for all .js files. This also updates source maps.
echo "BUILD: running terser"
find dist/cjs dist/esm -type f -name "*.js" \
  -exec sh -c '
    file="$1"
    terser "$file" \
      --mangle \
      --compress \
      --source-map "content=$file.map,filename=${file##*/},url=${file##*/}.map" \
      -o "$file"
  ' sh {} \;

# Generate minified browser bundles.
echo "BUILD: building for browser"
rolldown --input src/index.ts --format iife --minify --sourcemap --name QuoteQuote --file "${DIST_DIR}/quote-quote.min.js"
rolldown --input src/index.ts --format esm --minify --sourcemap --file "${DIST_DIR}/quote-quote.esm.min.js"

echo "BUILD: done!"
