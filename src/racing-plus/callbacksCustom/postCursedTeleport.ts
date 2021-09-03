import * as seededTeleports from "../features/mandatory/seededTeleports";

export function main(player: EntityPlayer): void {
  seededTeleports.postCursedTeleport(player);
}
