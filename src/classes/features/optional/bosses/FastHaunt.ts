import {
  EntityType,
  HauntVariant,
  NPCState,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ColorDefault,
  ModCallbackCustom,
  getNPCs,
  log,
  logError,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const FIRST_LIL_HAUNT_UPDATE_FRAME = 19;

/** After patch 1.7.8, all Haunt champions have a color index of -1 except for the black one. */
const BLACK_CHAMPION_COLOR_IDX = 0;

const v = {
  room: {
    /**
     * We track the Haunts that we have sped up because in rare cases (like the Boss Rush), Haunts
     * will skip frames 2 through 20.
     */
    spedUpHaunts: new Set<PtrHash>(),
  },
};

/** Speed up the first Lil' Haunt attached to a Haunt. */
export class FastHaunt extends ConfigurableModFeature {
  configKey: keyof Config = "FastHaunt";
  v = v;

  // 0, 260
  @CallbackCustom(
    ModCallbackCustom.POST_NPC_UPDATE_FILTER,
    EntityType.HAUNT,
    HauntVariant.HAUNT,
  )
  postNPCUpdateHaunt(npc: EntityNPC): void {
    this.checkDetachLilHaunts(npc);
    this.checkAngrySkinAnimation(npc);
  }

  checkDetachLilHaunts(npc: EntityNPC): void {
    // In vanilla, the first Lil' Haunt detaches on frame 91. We speed this up so that it happens on
    // the first frame that its `POST_NPC_UPDATE` callback fires.
    const ptrHash = GetPtrHash(npc);
    if (
      npc.FrameCount < FIRST_LIL_HAUNT_UPDATE_FRAME
      || v.room.spedUpHaunts.has(ptrHash)
    ) {
      return;
    }

    v.room.spedUpHaunts.add(ptrHash);

    const colorIdx = npc.GetBossColorIdx();
    const attachedLilHaunts = this.getAttachedLilHaunts(npc);
    if (colorIdx === BLACK_CHAMPION_COLOR_IDX) {
      // The black champion Haunt detaches all of his children at the same time.
      for (const lilHaunt of attachedLilHaunts) {
        this.detachLilHaunt(lilHaunt);
      }
    } else {
      // Only detach the one with the lowest index.
      const lowestIndexLilHaunt =
        this.getLowestIndexLilHaunt(attachedLilHaunts);
      if (lowestIndexLilHaunt === undefined) {
        logError(
          "Failed to get the Lil Haunt to detach when speeding up a Haunt.",
        );
      } else {
        this.detachLilHaunt(lowestIndexLilHaunt);
      }
    }
  }

  getAttachedLilHaunts(haunt: EntityNPC): readonly EntityNPC[] {
    const hauntPtrHash = GetPtrHash(haunt);
    const lilHaunts = getNPCs(EntityType.HAUNT, HauntVariant.LIL_HAUNT);
    const childrenLilHaunts: EntityNPC[] = [];
    for (const lilHaunt of lilHaunts) {
      // Only target Lil' Haunts attached to this Haunt.
      if (
        lilHaunt.Parent !== undefined
        && GetPtrHash(lilHaunt.Parent) === hauntPtrHash
      ) {
        childrenLilHaunts.push(lilHaunt);
      }
    }

    return childrenLilHaunts;
  }

  getLowestIndexLilHaunt(
    lilHaunts: readonly EntityNPC[],
  ): EntityNPC | undefined {
    if (lilHaunts.length === 0) {
      return undefined;
    }

    // eslint-disable-next-line unicorn/no-array-reduce
    return lilHaunts.reduce((lowestIndexLilHaunt, lilHaunt) =>
      lilHaunt.Index < lowestIndexLilHaunt.Index
        ? lilHaunt
        : lowestIndexLilHaunt,
    );
  }

  detachLilHaunt(npc: EntityNPC): void {
    // Setting their state to NPCState.MOVE detaches them from the parent.
    npc.State = NPCState.MOVE;

    // After detaching, the Lil' Haunt will remain faded, so manually set the color to be fully
    // opaque.
    npc.SetColor(ColorDefault, 0, 0);

    log(
      `Detached a Lil Haunt (at index ${npc.Index} when speeding up a Haunt.`,
    );
  }

  checkAngrySkinAnimation(npc: EntityNPC): void {
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

      default: {
        break;
      }
    }
  }
}
