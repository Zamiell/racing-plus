"""
By default, the following rooms have a variant prefix that overlaps with the X-axis flipped room
variant prefix. Thus, we change them to use a higher prefix:

- Button Room (Mines/Ashpit) (5000 to 40000)
- Secret Entrance (Mines/Ashpit) (10000 to 50000)
- Mineshaft Room (Mines/Ashpit) (10000 to 60000)

Also see "changes-room.md".
"""

import os
import xml.etree.ElementTree as ET

from utils import printf, PROJECT_DIRECTORY


STB_DIRECTORY = os.path.join(
    PROJECT_DIRECTORY, "mod", "resources", "rooms", "pre-flipped"
)

DEPTHS_FILE_NAMES = ["29.mines.xml", "30.ashpit.xml"]

VANILLA_BUTTON_ROOM_VARIANT_PREFIX = 5000
CUSTOM_BUTTON_ROOM_VARIANT_PREFIX = 40000
VANILLA_SECRET_ENTRANCE_VARIANT_PREFIX = 10000
CUSTOM_SECRET_ENTRANCE_VARIANT_PREFIX = 50000
VANILLA_MINESHAFT_ROOM_VARIANT_PREFIX = 10000
CUSTOM_MINESHAFT_ROOM_VARIANT_PREFIX = 60000


def main():
    for file_name in DEPTHS_FILE_NAMES:
        file_path = os.path.join(STB_DIRECTORY, file_name)
        parse_room_xml(file_path)


def parse_room_xml(file_path):
    printf("Parsing room XML: {}".format(file_path))
    tree = ET.parse(file_path)
    rooms = tree.getroot()
    for room in rooms:
        change_room_variant(room)

    new_file_path = file_path + ".updated"
    tree.write(new_file_path)
    printf("Wrote new XML file: {}".format(new_file_path))
    printf()


def change_room_variant(room):
    room_variant_string = room.attrib["variant"]
    room_variant = int(room_variant_string)
    if room_variant >= 40000:
        return

    if is_button_room(room):
        new_room_variant = (
            room_variant
            - VANILLA_BUTTON_ROOM_VARIANT_PREFIX
            + CUSTOM_BUTTON_ROOM_VARIANT_PREFIX
        )
        new_room_variant_string = str(new_room_variant)
        room.attrib["variant"] = new_room_variant_string

    elif is_secret_entrance(room):
        new_room_variant = (
            room_variant
            - VANILLA_SECRET_ENTRANCE_VARIANT_PREFIX
            + CUSTOM_SECRET_ENTRANCE_VARIANT_PREFIX
        )
        new_room_variant_string = str(new_room_variant)
        room.attrib["variant"] = new_room_variant_string

    elif is_mineshaft_room(room):
        new_room_variant = (
            room_variant
            - VANILLA_MINESHAFT_ROOM_VARIANT_PREFIX
            + CUSTOM_MINESHAFT_ROOM_VARIANT_PREFIX
        )
        new_room_variant_string = str(new_room_variant)
        room.attrib["variant"] = new_room_variant_string


def is_button_room(room):
    room_type_string = room.attrib["type"]
    room_type = int(room_type_string)
    room_sub_type_string = room.attrib["subtype"]
    room_sub_type = int(room_sub_type_string)

    return room_type == 1 and room_sub_type == 1


def is_secret_entrance(room):
    room_type_string = room.attrib["type"]
    room_type = int(room_type_string)
    room_sub_type_string = room.attrib["subtype"]
    room_sub_type = int(room_sub_type_string)

    return room_type == 1 and room_sub_type == 10


def is_mineshaft_room(room):
    room_type_string = room.attrib["type"]
    room_type = int(room_type_string)
    room_sub_type_string = room.attrib["subtype"]
    room_sub_type = int(room_sub_type_string)

    return room_type == 1 and room_sub_type >= 11


if __name__ == "__main__":
    main()
