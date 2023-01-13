#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "$DIR"

FILE_NAME="debug.txt"
npx eslint --print-config ./src/main.ts > "$FILE_NAME"
echo "Created file: $FILE_NAME"
