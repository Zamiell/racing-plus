#!/bin/bash
# http://stackoverflow.com/questions/18993438/shebang-env-preferred-python-version
# http://stackoverflow.com/questions/12070516/conditional-shebang-line-for-different-versions-of-python
""":"
which python3 >/dev/null 2>&1 && exec python3 "$0" "$@"
which python  >/dev/null 2>&1 && exec python  "$0" "$@"
exec echo "Error: requires python"
":"""

import hashlib
import json
import os
import shutil

MOD_NAME = "racing-plus"
SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
PROJECT_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, "..")
SHA1_FILE_PATH = os.path.join(PROJECT_DIRECTORY, "sha1.json")

GAME_DIRECTORY = os.path.join(
    "C:",
    os.sep,
    "Program Files (x86)",
    "Steam",
    "steamapps",
    "common",
    "The Binding of Isaac Rebirth",
)
TARGET_MOD_DIRECTORY = os.path.join(GAME_DIRECTORY, "mods", MOD_NAME)
PRE_FLIPPED_DIRECTORY = os.path.join(
    TARGET_MOD_DIRECTORY, "resources", "rooms", "pre-flipped"
)


def main():
    # Remove the "pre-flipped" directory, since it isn't necessary to send this to the end-user
    printf("Removing the pre-flipped directory...")
    removePreFlippedDirectory()

    # Make SHA1 hashes of every file so that the client can validate the mod's integrity
    printf("Getting SHA1 hashes of every file...")
    sha1_hashes = get_sha1_hashes()
    printf('Writing the hashes to "SHA1_FILE_PATH"...')
    write_hashes_to_json_file(sha1_hashes)

    printf("Complete!")


def removePreFlippedDirectory():
    if os.path.exists(PRE_FLIPPED_DIRECTORY):
        shutil.rmtree(PRE_FLIPPED_DIRECTORY)


def get_sha1_hashes():
    hashes = {}
    for root, _, files in os.walk(TARGET_MOD_DIRECTORY):
        for file_path in [os.path.join(root, f) for f in files]:
            prefixLength = len(TARGET_MOD_DIRECTORY + "\\")
            choppedPath = file_path[prefixLength:]
            hashes[choppedPath] = get_file_hash(file_path)

    return hashes


def write_hashes_to_json_file(sha1_hashes):
    # By default, the file will be created with "\r\n" end-of-line separators
    with open(SHA1_FILE_PATH, "w", newline="\n") as file_pointer:
        # By default, the JSON will be all combined into a single line, so we specify the indent to make it pretty
        # By default, the JSON will be dumped in a random order, so we use "sort_keys" to make it alphabetical
        json.dump(sha1_hashes, file_pointer, indent=4, sort_keys=True)


# From: https://gist.github.com/techtonik/5175896
def get_file_hash(file_path):
    block_size = 64 * 1024
    sha = hashlib.sha1()
    with open(file_path, "rb") as file_pointer:
        while True:
            data = file_pointer.read(block_size)
            if not data:
                break
            sha.update(data)

    return sha.hexdigest()


def printf(*args):
    print(*args, flush=True)


if __name__ == "__main__":
    main()
