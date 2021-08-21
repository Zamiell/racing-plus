import * as allowVanillaPathsInRepentanceChallenge from "../allowVanillaPathsInRepentanceChallenge";
import { inSpeedrun } from "../speedrun";

export function door(gridEntity: GridEntity): void {
  if (!inSpeedrun()) {
    return;
  }

  allowVanillaPathsInRepentanceChallenge.postGridEntityUpdateDoor(gridEntity);
}
