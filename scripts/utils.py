import sys


def error(msg):
    printf("Error: {}".format(msg))
    sys.exit(1)


def printf(*args):
    print(*args, flush=True)
