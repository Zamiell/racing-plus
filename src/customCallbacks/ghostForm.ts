import * as fastClearClearRoom from "../features/optional/major/fastClear/clearRoom";
import g from "../globals";
import { getPlayerLuaTableIndex, getPlayers } from "../misc";

export function postUpdate(): void {
  for (const player of getPlayers()) {
    const ghostForm = isGhostForm(player);
    const index = getPlayerLuaTableIndex(player);
    if (ghostForm !== g.run.ghostForm.get(index)) {
      g.run.ghostForm.set(index, ghostForm);
      ghostFormChanged(ghostForm);
    }
  }
}

function isGhostForm(player: EntityPlayer) {
  return player.GetEffects().HasNullEffect(NullItemID.ID_LOST_CURSE);
}
function ghostFormChanged(ghostForm: boolean) {
  if (ghostForm) {
    ghostFormOn();
  } else {
    ghostFormOff();
  }
}

function ghostFormOn() {
  fastClearClearRoom.setDeferClearForGhost(true);
}

function ghostFormOff(): void {}
