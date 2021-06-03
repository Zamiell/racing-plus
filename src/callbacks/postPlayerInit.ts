import g from "../globals";

export function main(player: EntityPlayer): void {
  // Cache the player object so that we don't have to repeatedly call Isaac.GetPlayer()
  const character = player.GetPlayerType();
  if (
    character !== PlayerType.PLAYER_ESAU &&
    character !== PlayerType.PLAYER_THESOUL_B
  ) {
    g.p = player;
  }
}
