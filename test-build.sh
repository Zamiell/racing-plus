#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Test to see if the compiled output matches the source code
cd "$DIR"
LUA_TEST_FILE="main.test.lua"
npx tstl --luaBundle $LUA_TEST_FILE
diff "$DIR/mod/main.lua" "$DIR/mod/$LUA_TEST_FILE"
# (diff will return with an exit code of 1 if there are any differences)

echo "Success!"
