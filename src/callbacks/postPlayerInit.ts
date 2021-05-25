import g from "../globals";

export function main(player: EntityPlayer): void {
  // Cache the player object so that we don't have to repeatedly call Isaac.GetPlayer()
  g.p = player;
}
