#!/bin/bash -eu

set -e # Exit on error.

# Change to project root
ROOT="$(pwd)/$(dirname "$0")/.."
cd "$ROOT" || exit 1

# Prepare "dist" directory.
DIST_DIR="$ROOT/dist"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Build each module type.
# Regarding comments in declaration files:
# https://github.com/microsoft/TypeScript/issues/14619#issuecomment-1971477006
for MODULE_TYPE in esm cjs; do
  echo "BUILD: building ${MODULE_TYPE}"
  NODE_DIST_DIR="$DIST_DIR/${MODULE_TYPE}"
  tsc -p tsconfig.${MODULE_TYPE}.json --removeComments && tsc -p tsconfig.${MODULE_TYPE}.json --declaration --emitDeclarationOnly

  # CJS: Add package.json with `type: commonjs`.
  if [ "$MODULE_TYPE" = "cjs" ]; then
    echo "{\"type\":\"commonjs\"}" > "$NODE_DIST_DIR/package.json"
  fi
done

# Run terser for all .js files. This also updates source maps.
echo "BUILD: running terser"
find dist -type f -name "*.js" -exec sh -c 'terser "$0" --mangle --compress --source-map "content=$0.map,filename=${0##*/},url=${0##*/}.map" -o "$0"' {} \;

echo "BUILD: done!"
