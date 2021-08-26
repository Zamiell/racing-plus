#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ "$1" == "reset" ]; then
  npm uninstall isaacscript-common --save
  npm install isaacscript-common --save
else
  npm uninstall isaacscript-common --save
  npm install ../isaacscript-common --save
fi

echo "Complete!"
