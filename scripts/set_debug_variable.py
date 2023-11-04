import os

from utils import error, PROJECT_DIRECTORY

GLOBALS_TS_PATH = os.path.join(PROJECT_DIRECTORY, "src", "classes", "Globals.ts")


def set_debug_variable(enabled: bool):
    if not os.path.exists(GLOBALS_TS_PATH):
        error("The globals file does not exist at: {}".format(GLOBALS_TS_PATH))

    with open(GLOBALS_TS_PATH, "rb") as file:
        file_data = file.read()

    file_string = file_data.decode("utf-8")
    if enabled:
        file_string = file_string.replace("debug = false;", "debug = true;")
    else:
        file_string = file_string.replace("debug = true;", "debug = false;")

    file_data = file_string.encode("utf-8")

    with open(GLOBALS_TS_PATH, "wb") as file:
        file.write(file_data)
