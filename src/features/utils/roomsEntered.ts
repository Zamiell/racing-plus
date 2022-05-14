import { saveDataManager } from "isaacscript-common";

const v = {
  run: {
    roomsEntered: 0,
  },
};

export function init(): void {
  saveDataManager("roomsEntered", v);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  v.run.roomsEntered += 1;
}

export function getRoomsEntered(): int {
  return v.run.roomsEntered;
}

export function decrementRoomsEntered(): void {
  v.run.roomsEntered -= 1;
}
