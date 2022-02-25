// Speed up the first Lil' Haunt (260.10) attached to a Haunt (260.0)

import { getNPCs } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const FIRST_LIL_HAUNT_UPDATE_FRAME = 19;
const BLACK_CHAMPION_COLOR_IDX = 17;

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_THE_HAUNT (260)
export function postNPCUpdateHaunt(npc: EntityNPC): void {
  if (!config.fastHaunt) {
    return;
  }

  // Only target Haunts
  if (npc.Variant !== 0) {
    return;
  }

  checkDetachLilHaunts(npc);
  checkAngrySkinAnimation(npc);
}

function checkDetachLilHaunts(npc: EntityNPC) {
  // In vanilla, the first Lil' Haunt detaches on frame 91
  // We speed this up so that it happens on frame 19
  // (which is the first frame that its respective PostNPCUpdate callback fires)
  if (npc.FrameCount !== FIRST_LIL_HAUNT_UPDATE_FRAME) {
    return;
  }

  const colorIdx = npc.GetBossColorIdx();
  const attachedLilHaunts = getAttachedLilHaunts(npc);
  if (colorIdx === BLACK_CHAMPION_COLOR_IDX) {
    // The black champion Haunt detaches all of his children at the same time
    attachedLilHaunts.forEach((lilHaunt: EntityNPC) => {
      detachLilHaunt(lilHaunt);
    });
  } else {
    // Only detach the one with the lowest index
    const lowestIndexLilHaunt = getLowestIndexLilHaunt(attachedLilHaunts);
    if (lowestIndexLilHaunt !== null) {
      detachLilHaunt(lowestIndexLilHaunt);
    }
  }
}

function getAttachedLilHaunts(haunt: EntityNPC) {
  const hauntPtrHash = GetPtrHash(haunt);
  const lilHaunts = getNPCs(
    EntityType.ENTITY_THE_HAUNT,
    HauntVariant.LIL_HAUNT,
  );
  const childrenLilHaunts: EntityNPC[] = [];
  for (const lilHaunt of lilHaunts) {
    // Only target Lil' Haunts attached to this Haunt
    if (
      lilHaunt.Parent !== undefined &&
      GetPtrHash(lilHaunt.Parent) === hauntPtrHash
    ) {
      childrenLilHaunts.push(lilHaunt);
    }
  }

  return childrenLilHaunts;
}

function getLowestIndexLilHaunt(lilHaunts: EntityNPC[]) {
  return lilHaunts.reduce((lowestIndexLilHaunt, lilHaunt) =>
    lilHaunt.Index < lowestIndexLilHaunt.Index ? lilHaunt : lowestIndexLilHaunt,
  );
}

function detachLilHaunt(npc: EntityNPC) {
  // Setting their state to NpcState.STATE_MOVE detaches them from the parent
  npc.State = NpcState.STATE_MOVE;

  // After detaching, the Lil' Haunt will remain faded, so manually set the color to be fully opaque
  npc.SetColor(Color.Default, 0, 0);
}

function checkAngrySkinAnimation(npc: EntityNPC) {
  // The Haunt will play the "AngrySkin" animation when all of the Lil' Haunts are defeated
  // Speed this up by a factor of 2
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();

  switch (animation) {
    case "AngrySkin": {
      const spedUpSpeed = 2;
      if (sprite.PlaybackSpeed !== spedUpSpeed) {
        sprite.PlaybackSpeed = spedUpSpeed;
      }

      break;
    }

    case "Peel": {
      const spedUpSpeed = 4;
      if (sprite.PlaybackSpeed !== spedUpSpeed) {
        sprite.PlaybackSpeed = spedUpSpeed;
      }

      break;
    }

    case "IdleNoSkin": {
      const normalSpeed = 1;
      if (sprite.PlaybackSpeed !== normalSpeed) {
        sprite.PlaybackSpeed = normalSpeed;
      }

      break;
    }

    default: {
      break;
    }
  }
}
