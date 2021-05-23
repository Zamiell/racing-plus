import os
import shutil
import sys
import write_version

MOD_NAME = "racing-plus"
SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)

GAME_DIRECTORY = os.path.join(
    "C:",
    os.sep,
    "Program Files (x86)",
    "Steam",
    "steamapps",
    "common",
    "The Binding of Isaac Rebirth",
)
TARGET_MOD_DIRECTORY = os.path.join(GAME_DIRECTORY, "mods", MOD_NAME)
PRE_FLIPPING_DIRECTORY = os.path.join(
    TARGET_MOD_DIRECTORY, "resources", "rooms", "pre-flipping"
)


def main():
    # Remove the "pre-flipping" directory, since it isn't necessary to send this to the end-user
    if os.path.exists(PRE_FLIPPING_DIRECTORY):
        shutil.rmtree(PRE_FLIPPING_DIRECTORY)

    # Draw the version on the title screen
    write_version.main()


if __name__ == "__main__":
    main()