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
import sys
import write_version
import xmltodict

SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
ROOMS_DIRECTORY = os.path.join(
    SCRIPT_DIRECTORY, "..", "mod", "resources", "rooms", "pre-flipping/"
)
XML_FILES_TO_CONVERT = [
    "angelRooms",
    "devilRooms",
]
JSON_OUTPUT_DIRECTORY = os.path.join(
    SCRIPT_DIRECTORY,
    "..",
    "src",
    "racing-plus",
    "features",
    "optional",
    "major",
    "betterDevilAngelRooms",
)


def main():
    # Draw the version on the title screen
    write_version.main()

    # Convert some room XML files to JSON so that they can be directly imported by the mod
    convertXMLToJSON()


def convertXMLToJSON():
    for file_to_convert in XML_FILES_TO_CONVERT:
        # Read the file into a string
        file_name = file_to_convert + ".xml"
        file_path = os.path.join(ROOMS_DIRECTORY, file_name)
        with open(file_path, "r") as file_handle:
            file_contents = file_handle.read()

        # Convert the XML string to a Python dictionary
        dict = xmltodict.parse(file_contents)

        # Convert the Python dictionary to a JSON string
        # (we specify the separators to remove all extra whitespace)
        jsonString = json.dumps(dict, separators=(",", ":"))

        # Write the JSON to disk
        output_file_name = file_to_convert + ".json"
        output_file_path = os.path.join(JSON_OUTPUT_DIRECTORY, output_file_name)
        with open(output_file_path, "w") as file_handle:
            file_handle.write(jsonString)

        print("Created: {}".format(output_file_path))


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    main()
