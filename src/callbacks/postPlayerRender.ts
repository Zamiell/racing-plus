import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";

export function main(player: EntityPlayer): void {
  fastTeleports.postPlayerRender(player);
}
