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
import sys
import write_version
import xmltodict

from get_version_from_package_json import get_version_from_package_json


SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
GLOBALS_TS_PATH = os.path.join(SCRIPT_DIRECTORY, "..", "src", "types", "Globals.ts")
ROOMS_DIRECTORY = os.path.join(
    SCRIPT_DIRECTORY, "..", "mod", "resources", "rooms", "pre-flipping"
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
    # Draw the version on the title screen
    write_version.main()

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
        # Read the file into a string
        file_name = file_to_convert + ".xml"
        file_path = os.path.join(ROOMS_DIRECTORY, file_name)
        with open(file_path, "r") as file:
            file_contents = file.read()

        # Convert the XML string to a Python dictionary
        dict = xmltodict.parse(file_contents)

        # Convert the Python dictionary to a JSON string
        # (we specify the separators to remove all extra whitespace)
        jsonString = json.dumps(dict, separators=(",", ":"))

        # Write the JSON to disk
        output_file_name = file_to_convert + ".json"
        output_file_path = os.path.join(JSON_OUTPUT_DIRECTORY, output_file_name)
        with open(output_file_path, "w") as file:
            file.write(jsonString)

        print("Created: {}".format(output_file_path))


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    main()
