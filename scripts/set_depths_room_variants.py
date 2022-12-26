"""
By default, the following rooms have a variant prefix that overlaps with the X-axis flipped room
variant prefix. Thus, we change them to use a higher prefix:

- Fool Card Room (Depths/Necropolis/Dank) (10000 to 40000)

Also see "changes-room.md".
"""

import os
import xml.etree.ElementTree as ET

from utils import printf, PROJECT_DIRECTORY


STB_DIRECTORY = os.path.join(
    PROJECT_DIRECTORY, "mod", "resources", "rooms", "pre-flipped"
)

DEPTHS_FILE_NAMES = ["07.depths.xml", "08.necropolis.xml", "09.dank depths.xml"]

VANILLA_FOOL_ROOM_VARIANT_PREFIX = 10000
CUSTOM_FOOL_ROOM_VARIANT_PREFIX = 40000


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
    if not is_fool_room(room):
        return

    room_variant_string = room.attrib["variant"]
    room_variant = int(room_variant_string)
    if room_variant >= CUSTOM_FOOL_ROOM_VARIANT_PREFIX:
        return

    new_room_variant = (
        room_variant
        - VANILLA_FOOL_ROOM_VARIANT_PREFIX
        + CUSTOM_FOOL_ROOM_VARIANT_PREFIX
    )
    new_room_variant_string = str(new_room_variant)
    room.attrib["variant"] = new_room_variant_string


def is_fool_room(room):
    room_type = room.attrib["type"]
    room_sub_type = room.attrib["subtype"]

    return room_type == "1" and room_sub_type == "1"


if __name__ == "__main__":
    main()
