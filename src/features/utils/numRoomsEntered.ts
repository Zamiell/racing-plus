import { mod } from "../../mod";

const v = {
  run: {
    numRoomsEntered: 0,
  },
};

export function init(): void {
  mod.saveDataManager("roomsEntered", v);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  v.run.numRoomsEntered++;
}

export function getNumRoomsEntered(): int {
  return v.run.numRoomsEntered;
}

export function decrementNumRoomsEntered(): void {
  v.run.numRoomsEntered--;
}
