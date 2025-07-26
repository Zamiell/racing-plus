import { EffectVariant, StageType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ColorDefault,
  ModCallbackCustom,
  game,
  inStartingRoom,
  onFirstFloor,
  onStageType,
  spawnEffect,
} from "isaacscript-common";
import { CreepRedSubTypeCustom } from "../../../../enums/CreepRedSubTypeCustom";
import { RaceFormat } from "../../../../enums/RaceFormat";
import { RaceStatus } from "../../../../enums/RaceStatus";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { g } from "../../../../globals";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const BURNING_BASEMENT_COLOR = Color(0.5, 0.5, 0.5);

/**
 * Racing+ reimplements the controls graphic in the starting room so that it will not interfere with
 * other kinds of graphics. Some code is borrowed from Revelations / StageAPI.
 */
export class DrawControls extends ConfigurableModFeature {
  configKey: keyof Config = "DrawControls";

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (this.shouldDrawControlsGraphic()) {
      this.drawControlsGraphic();
    }
  }

  /**
   * Only draw the graphic in the starting room of the first floor. We ignore Greed Mode to simplify
   * things, even though on vanilla, the sprite will display in Greed Mode.
   */
  shouldDrawControlsGraphic(): boolean {
    const isGreedMode = game.IsGreedMode();

    return (
      !isGreedMode
      && onFirstFloor()
      && inStartingRoom()
      && !this.inSeededOrDiversityRace()
    );
  }

  inSeededOrDiversityRace(): boolean {
    return (
      g.race.status === RaceStatus.IN_PROGRESS
      && g.race.myStatus === RacerStatus.RACING
      && (g.race.format === RaceFormat.SEEDED
        || g.race.format === RaceFormat.DIVERSITY)
    );
  }

  drawControlsGraphic(): void {
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();

    // Spawn the custom "Floor Effect Creep" entity.
    const controlsEffect = spawnEffect(
      EffectVariant.PLAYER_CREEP_RED,
      CreepRedSubTypeCustom.FLOOR_EFFECT_CREEP,
      centerPos,
    );

    controlsEffect.CollisionDamage = 0;
    controlsEffect.Timeout = 1_000_000;

    // Always set the scale to 1 in case the player has an item like Lost Cork. (Otherwise, it will
    // have a scale of 1.75.)
    controlsEffect.Scale = 1;

    const controlsSprite = controlsEffect.GetSprite();
    controlsSprite.Load("gfx/backdrop/controls_custom.anm2", true);
    const defaultAnimation = controlsSprite.GetDefaultAnimation();
    controlsSprite.Play(defaultAnimation, true);

    // On vanilla, the sprite is a slightly different color on the Burning Basement.
    controlsSprite.Color = onStageType(StageType.AFTERBIRTH)
      ? BURNING_BASEMENT_COLOR
      : ColorDefault;
  }
}
