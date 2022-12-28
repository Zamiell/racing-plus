#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

SECONDS=0

cd "$DIR"

# Step 1 - Use Prettier to check formatting.
npx prettier --check .

# Step 2 - Use ESLint to lint the TypeScript.
# We use "--max-warnings" so that any warnings will fail in CI.
npx eslint --max-warnings 0 .

# Step 3 - Spell check every file using CSpell.
# We use "--no-progress" and "--no-summary" because we want to only output errors.
# We use "--gitignore" because we want to ignore files which will are not included in the repo.
# (The VS Code extension ignores gitignore files by default, so we want the CLI to be unified with
# the editor.)
npx cspell --no-progress --no-summary --gitignore

# Step 4 - Check for orphaned words.
bash "$DIR/check-orphaned-words.sh"

# Step 5 - Use xmllint to lint XML files.
# (Skip this step if xmllint is not currently installed for whatever reason.)
if command -v xmllint &> /dev/null; then
  find "$DIR/mod" -name "*.xml" -print0 | xargs -0 xmllint --noout
fi

# Step 6 - Check for unused imports.
# The "--error" flag makes it return an error code of 1 if unused exports are found.
npx ts-prune --error

# Step 7 - Check for base file updates.
bash "$DIR/check-file-updates.sh"

echo "Successfully linted in $SECONDS seconds."
