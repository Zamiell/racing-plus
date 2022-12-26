import os
import sys

SCRIPT_PATH = os.path.realpath(__file__)
SCRIPT_DIRECTORY = os.path.dirname(SCRIPT_PATH)
PROJECT_DIRECTORY = os.path.join(SCRIPT_DIRECTORY, "..")


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(*args):
    print(*args, flush=True)
