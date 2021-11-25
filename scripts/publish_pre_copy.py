#!/bin/bash
# http://stackoverflow.com/questions/18993438/shebang-env-preferred-python-version
# http://stackoverflow.com/questions/12070516/conditional-shebang-line-for-different-versions-of-python
""":"
which python3 >/dev/null 2>&1 && exec python3 "$0" "$@"
which python  >/dev/null 2>&1 && exec python  "$0" "$@"
exec echo "Error: requires python"
":"""

import json
import os
import re
import subprocess
import sys
import write_version_on_title_screen

from get_version_from_package_json import get_version_from_package_json


SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
GLOBALS_TS_PATH = os.path.join(SCRIPT_DIRECTORY, "..", "src", "types", "Globals.ts")
ROOMS_DIRECTORY = os.path.join(
    SCRIPT_DIRECTORY, "..", "mod", "resources", "rooms", "pre-flipped"
)
XML_FILES_TO_CONVERT = [
    "angelRooms",
    "devilRooms",
]
JSON_OUTPUT_DIRECTORY = os.path.join(
    SCRIPT_DIRECTORY,
    "..",
    "src",
    "features",
    "optional",
    "major",
    "betterDevilAngelRooms",
)


def main():
    write_version_on_title_screen.main()

    setDebugVariableToFalse()

    # Convert some room XML files to JSON so that they can be directly imported by the mod
    convertXMLToJSON()


def setDebugVariableToFalse():
    if not os.path.exists(GLOBALS_TS_PATH):
        error("The globals file does not exist at: {}".format(GLOBALS_TS_PATH))

    with open(GLOBALS_TS_PATH, "rb") as file:
        file_data = file.read()

    file_string = file_data.decode("utf-8")
    file_string = file_string.replace("debug = true;", "debug = false;")
    file_data = file_string.encode("utf-8")

    with open(GLOBALS_TS_PATH, "wb") as file:
        file.write(file_data)


def convertXMLToJSON():
    for file_to_convert in XML_FILES_TO_CONVERT:
        xml_file_name = file_to_convert + ".xml"
        xml_file_path = os.path.join(ROOMS_DIRECTORY, xml_file_name)

        json_file_name = file_to_convert + ".json"
        json_file_path = os.path.join(JSON_OUTPUT_DIRECTORY, json_file_name)

        completed_process = subprocess.run(
            ["npx", "convert-xml-to-json", xml_file_path, json_file_path],
            check=True,
            shell=True,
        )

        if completed_process.returncode != 0:
            error("The XML to JSON conversion failed.")

        print("Created: {}".format(json_file_path))


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(*args):
    print(*args, flush=True)


if __name__ == "__main__":
    main()
