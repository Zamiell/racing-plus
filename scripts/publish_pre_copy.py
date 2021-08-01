#!/bin/bash
# http://stackoverflow.com/questions/18993438/shebang-env-preferred-python-version
# http://stackoverflow.com/questions/12070516/conditional-shebang-line-for-different-versions-of-python
""":"
which python3 >/dev/null 2>&1 && exec python3 "$0" "$@"
which python  >/dev/null 2>&1 && exec python  "$0" "$@"
exec echo "Error: requires python"
":"""

import os
import subprocess
import sys
import write_version

SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
CONVERT_SCRIPT_PATH = os.path.join(SCRIPT_DIRECTORY, "convert_xml_to_lua.lua")


def main():
    # Draw the version on the title screen
    write_version.main()

    # Convert the Devil and Angel XML files to Lua tables
    convertXMLToLua()


def convertXMLToLua():
    if not os.path.exists(CONVERT_SCRIPT_PATH):
        error(
            'The Lua script located at "{}" does not exist.'.format(CONVERT_SCRIPT_PATH)
        )

    completed_process = subprocess.run(["lua.exe", CONVERT_SCRIPT_PATH])
    if completed_process.returncode != 0:
        error('Failed to run the "{}" script.'.format(CONVERT_SCRIPT_PATH))


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    main()
