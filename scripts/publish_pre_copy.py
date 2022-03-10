import os
import subprocess
import write_version_on_title_screen

from get_version_from_package_json import get_version_from_package_json
from set_debug_variable import set_debug_variable
from utils import error


SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
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

    set_debug_variable(False)

    # Convert some room XML files to JSON so that they can be directly imported by the mod
    convert_XML_to_JSON()


def convert_XML_to_JSON():
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


if __name__ == "__main__":
    main()
