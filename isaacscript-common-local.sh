#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ "$1" == "reset" ]; then
  yarn remove isaacscript-common
  yarn add isaacscript-common
else
  yarn remove isaacscript-common
  yarn add ../isaacscript/dist/packages/isaacscript-common
fi

echo "Complete!"
