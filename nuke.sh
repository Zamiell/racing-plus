#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

NPM_LOCK="$DIR/package-lock.json"
rm -f "$NPM_LOCK"
echo "Successfully deleted: $NPM_LOCK"

YARN_LOCK="$DIR/yarn.lock"
rm -f "$YARN_LOCK"
echo "Successfully deleted: $YARN_LOCK"

NODE_MODULES="$DIR/node_modules"
rm -rf "$NODE_MODULES"
echo "Successfully deleted: $NODE_MODULES"

yarn install
echo "Successfully reinstalled Node dependencies."
