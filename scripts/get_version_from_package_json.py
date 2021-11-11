import json
import os
import sys

SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
PACKAGE_JSON_PATH = os.path.join(SCRIPT_DIRECTORY, "..", "package.json")


def get_version_from_package_json():
    with open(PACKAGE_JSON_PATH, "r") as file_handle:
        package_json = json.load(file_handle)

    if "version" not in package_json:
        error('Failed to find the version in the "{}" file.'.format(PACKAGE_JSON_PATH))

    return package_json["version"]


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(*args):
    print(*args, flush=True)
