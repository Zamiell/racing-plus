import json
import os

from utils import error, PROJECT_DIRECTORY

PACKAGE_JSON_PATH = os.path.join(PROJECT_DIRECTORY, "package.json")


def get_version_from_package_json():
    with open(PACKAGE_JSON_PATH, "r") as file_handle:
        package_json = json.load(file_handle)

    if "version" not in package_json:
        error('Failed to find the version in the "{}" file.'.format(PACKAGE_JSON_PATH))

    return package_json["version"]
