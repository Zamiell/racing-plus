import * as fastClearClearRoom from "../features/optional/major/fastClear/clearRoom";
import g from "../globals";
import { getPlayers } from "../misc";

export function postUpdate(): void {
  for (const player of getPlayers()) {
    const ghostForm = isGhostForm(player);
    if (ghostForm !== g.run.ghostForm.get(player.ControllerIndex)) {
      g.run.ghostForm.set(player.ControllerIndex, ghostForm);
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
