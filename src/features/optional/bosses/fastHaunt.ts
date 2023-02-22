// Speed up the first Lil' Haunt (260.10) attached to a Haunt (260.0).

import {
  EntityType,
  HauntVariant,
  NpcState,
} from "isaac-typescript-definitions";
import { asNumber, ColorDefault, getNPCs } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const FIRST_LIL_HAUNT_UPDATE_FRAME = 19;

/** After patch 1.7.8, all Haunt champions have a color index of -1 except for the black one. */
const BLACK_CHAMPION_COLOR_IDX = 0;

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.THE_HAUNT (260)
export function postNPCUpdateHaunt(npc: EntityNPC): void {
  if (!config.FastHaunt) {
    return;
  }

  if (npc.Variant !== asNumber(HauntVariant.HAUNT)) {
    return;
  }

  checkDetachLilHaunts(npc);
  checkAngrySkinAnimation(npc);
}

function checkDetachLilHaunts(npc: EntityNPC) {
  // In vanilla, the first Lil' Haunt detaches on frame 91. We speed this up so that it happens on
  // the first frame that its `POST_NPC_UPDATE` callback fires.
  if (npc.FrameCount !== FIRST_LIL_HAUNT_UPDATE_FRAME) {
    return;
  }

  const colorIdx = npc.GetBossColorIdx();
  const attachedLilHaunts = getAttachedLilHaunts(npc);
  if (colorIdx === BLACK_CHAMPION_COLOR_IDX) {
    // The black champion Haunt detaches all of his children at the same time.
    attachedLilHaunts.forEach((lilHaunt: EntityNPC) => {
      detachLilHaunt(lilHaunt);
    });
  } else {
    // Only detach the one with the lowest index.
    const lowestIndexLilHaunt = getLowestIndexLilHaunt(attachedLilHaunts);
    if (lowestIndexLilHaunt !== undefined) {
      detachLilHaunt(lowestIndexLilHaunt);
    }
  }
}

function getAttachedLilHaunts(haunt: EntityNPC) {
  const hauntPtrHash = GetPtrHash(haunt);
  const lilHaunts = getNPCs(EntityType.THE_HAUNT, HauntVariant.LIL_HAUNT);
  const childrenLilHaunts: EntityNPC[] = [];
  for (const lilHaunt of lilHaunts) {
    // Only target Lil' Haunts attached to this Haunt.
    if (
      lilHaunt.Parent !== undefined &&
      GetPtrHash(lilHaunt.Parent) === hauntPtrHash
    ) {
      childrenLilHaunts.push(lilHaunt);
    }
  }

  return childrenLilHaunts;
}

function getLowestIndexLilHaunt(lilHaunts: EntityNPC[]): EntityNPC | undefined {
  if (lilHaunts.length === 0) {
    return undefined;
  }

  return lilHaunts.reduce((lowestIndexLilHaunt, lilHaunt) =>
    lilHaunt.Index < lowestIndexLilHaunt.Index ? lilHaunt : lowestIndexLilHaunt,
  );
}

function detachLilHaunt(npc: EntityNPC) {
  // Setting their state to NpcState.MOVE detaches them from the parent.
  npc.State = NpcState.MOVE;

  // After detaching, the Lil' Haunt will remain faded, so manually set the color to be fully
  // opaque.
  npc.SetColor(ColorDefault, 0, 0);
}

function checkAngrySkinAnimation(npc: EntityNPC) {
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();

  switch (animation) {
    // The Haunt will play the "AngrySkin" animation when all of the Lil' Haunts are defeated.
    case "AngrySkin": {
      sprite.PlaybackSpeed = 2;
      break;
    }

    case "Peel": {
      sprite.PlaybackSpeed = 4;
      break;
    }

    case "IdleNoSkin": {
      sprite.PlaybackSpeed = 1;
      break;
    }
  }
}
