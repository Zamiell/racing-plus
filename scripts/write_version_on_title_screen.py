# This script draw the version number on the title menu graphic

import json
import os
import sys

from PIL import Image, ImageFont, ImageDraw
from get_version_from_package_json import get_version_from_package_json

SCRIPT_NAME = os.path.basename(__file__)
SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
FONTS_DIRECTORY_PATH = os.path.join(SCRIPT_DIRECTORY, "fonts")
TITLE_FONT_PATH = os.path.join(FONTS_DIRECTORY_PATH, "jelly-crazies.ttf")
URL_FONT_PATH = os.path.join(FONTS_DIRECTORY_PATH, "vera.ttf")
MOD_DIRECTORY_PATH = os.path.join(SCRIPT_DIRECTORY, "..", "mod")
ENGLISH_RESOURCES_DIRECTOR_PATH = os.path.join(MOD_DIRECTORY_PATH, "resources")
MAIN_MENU_DIRECTORY_PATH = os.path.join(
    ENGLISH_RESOURCES_DIRECTOR_PATH, "gfx", "ui", "main menu"
)
TITLE_MENU_TEMPLATE_PATH = os.path.join(
    MAIN_MENU_DIRECTORY_PATH, "titlemenu-template.png"
)
TITLE_MENU_FILE_1 = "titlemenu.png"  # For the normal title screen
TITLE_MENU_FILE_2 = "titlemenu_2.png"  # For the "Stop Playing!" title screen
LANGUAGE_SUFFIXES = ["de", "es", "jp", "kr", "ru", "zh"]

LARGE_FONT = ImageFont.truetype(TITLE_FONT_PATH, 9)
SMALL_FONT = ImageFont.truetype(TITLE_FONT_PATH, 6)
URL_FONT = ImageFont.truetype(URL_FONT_PATH, 11)
ALPHA_FONT = ImageFont.truetype(TITLE_FONT_PATH, 9)
COLOR = (67, 93, 145)
URL = "isaacracing.net"


def main():
    version = get_version_from_package_json()
    write_version(version)


def write_version(version):
    title_image = Image.open(TITLE_MENU_TEMPLATE_PATH)
    title_draw = ImageDraw.Draw(title_image)

    # Get the dimensions of how big the text will be
    combined_text = "V" + version
    width, height = title_draw.textsize(combined_text, font=LARGE_FONT)

    # Draw the version
    title_draw.text((420 - width / 2, 236), "V", COLOR, font=SMALL_FONT)  # The "V"
    title_draw.text((430 - width / 2, 230), version, COLOR, font=LARGE_FONT)

    # Draw the URL
    width, height = title_draw.textsize(URL, font=URL_FONT)
    title_draw.text((420 - width / 2, 250), URL, COLOR, font=URL_FONT)

    title_menu_file_1_path = os.path.join(MAIN_MENU_DIRECTORY_PATH, TITLE_MENU_FILE_1)
    title_image.save(title_menu_file_1_path)

    title_menu_file_2_path = os.path.join(MAIN_MENU_DIRECTORY_PATH, TITLE_MENU_FILE_2)
    title_image.save(title_menu_file_2_path)

    for language_suffix in LANGUAGE_SUFFIXES:
        resources_directory_name = "resources-dlc3." + language_suffix
        resources_directory_path = os.path.join(
            MOD_DIRECTORY_PATH, resources_directory_name
        )
        main_menu_directory_path = os.path.join(
            resources_directory_path, "gfx", "ui", "main menu"
        )

        title_menu_file_1_path = os.path.join(
            main_menu_directory_path, TITLE_MENU_FILE_1
        )
        title_image.save(title_menu_file_1_path)

        title_menu_file_2_path = os.path.join(
            main_menu_directory_path, TITLE_MENU_FILE_2
        )
        title_image.save(title_menu_file_2_path)

    printf("The title screen image was updated to version: {}".format(version))


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    main()
