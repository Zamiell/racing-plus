# This script draw the version number on the title menu graphic

import json
import os
import sys

from PIL import Image, ImageFont, ImageDraw

SCRIPT_NAME = os.path.basename(__file__)
SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
FONTS_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, "fonts")
TITLE_FONT_PATH = os.path.join(FONTS_DIRECTORY, "jelly-crazies.ttf")
URL_FONT_PATH = os.path.join(FONTS_DIRECTORY, "vera.ttf")
MAIN_MENU_DIRECTORY = os.path.join(
    SCRIPT_DIRECTORY, "..", "mod", "resources", "gfx", "ui", "main menu"
)
TITLE_MENU_TEMPLATE_PATH = os.path.join(MAIN_MENU_DIRECTORY, "titlemenu-template.png")
TITLE_MENU_OUTPUT_1 = os.path.join(MAIN_MENU_DIRECTORY, "titlemenu.png")
TITLE_MENU_OUTPUT_2 = os.path.join(MAIN_MENU_DIRECTORY, "titlemenu_2.png")
PACKAGE_JSON_PATH = os.path.join(SCRIPT_DIRECTORY, "..", "package.json")

LARGE_FONT = ImageFont.truetype(TITLE_FONT_PATH, 9)
SMALL_FONT = ImageFont.truetype(TITLE_FONT_PATH, 6)
URL_FONT = ImageFont.truetype(URL_FONT_PATH, 11)
ALPHA_FONT = ImageFont.truetype(TITLE_FONT_PATH, 9)
COLOR = (67, 93, 145)
URL = "isaacracing.net"


def main():
    version = get_version_from_package_json()
    write_version(version)


def get_version_from_package_json():
    with open(PACKAGE_JSON_PATH, "r") as file_handle:
        package_json = json.load(file_handle)

    if "version" not in package_json:
        error('Failed to find the version in the "{}" file.'.format(PACKAGE_JSON_PATH))

    return package_json["version"]


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

    # Draw the alpha warning
    alpha_text = "ALPHA"
    width, height = title_draw.textsize("Alpha", font=ALPHA_FONT)
    title_draw.text((412 - width / 2, 210), alpha_text, COLOR, font=ALPHA_FONT)

    title_image.save(TITLE_MENU_OUTPUT_1)
    title_image.save(TITLE_MENU_OUTPUT_2)
    printf("Title screen image updated to version: {}".format(version))


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(msg):
    print(msg, flush=True)


if __name__ == "__main__":
    main()
