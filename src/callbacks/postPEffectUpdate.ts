import * as sawblade from "../features/items/sawblade";

export function main(player: EntityPlayer): void {
  sawblade.postPEffectUpdatePlayer(player);
}
