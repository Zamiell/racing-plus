import {
  CardType,
  CollectibleType,
  EffectVariant,
  LaserVariant,
  LevelCurse,
  ModCallback,
  PillColor,
  PlayerType,
  PocketItemSlot,
  RoomType,
  TrinketSlot,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  ModCallbackCustom,
  RENDER_FRAMES_PER_SECOND,
  characterCanTakeFreeDevilDeals,
  findFreePosition,
  game,
  getEnumValues,
  getPlayerFromIndex,
  getPlayerIndex,
  inBeastRoom,
  inRoomType,
  isBeforeRenderFrame,
  isCharacter,
  isJacobOrEsau,
  isKeeper,
  onOrBeforeGameFrame,
  removeGridEntity,
  useActiveItemTemp,
} from "isaacscript-common";
import { RevivalType } from "../../../../enums/RevivalType";
import { SeededDeathState } from "../../../../enums/SeededDeathState";
import { TimerType } from "../../../../enums/TimerType";
import { inSeededRace } from "../../../../features/race/v";
import { mod } from "../../../../mod";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import { timerDraw } from "../../../../timer";
import { getEffectiveDevilDeals } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import {
  DEVIL_DEAL_BUFFER_GAME_FRAMES,
  SEEDED_DEATH_DEBUFF_RENDER_FRAMES,
  SEEDED_DEATH_FEATURE_NAME,
  SEEDED_DEATH_TIMER_SEASON_OFFSET_X,
  SEEDED_DEATH_TIMER_STARTING_X,
  SEEDED_DEATH_TIMER_STARTING_Y,
} from "./seededDeath/constants";
import {
  seededDeathApplyGhostFade,
  seededDeathDebuffOff,
  seededDeathDebuffOn,
  seededDeathSetCheckpointCollision,
} from "./seededDeath/seededDeathDebuff";
import { setSeededDeathState, v } from "./seededDeath/v";

export class SeededDeath extends MandatoryModFeature {
  v = v;

  override shouldCallbackMethodsFire = (): boolean =>
    inSeededRace() || onSeason(2);

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.updateGhostForm();
    this.checkTakingDevilItem();
  }

  updateGhostForm(): void {
    if (v.run.state !== SeededDeathState.GHOST_FORM) {
      return;
    }

    const player = Isaac.GetPlayer();

    // We have to re-apply the fade on every frame in case the player takes a pill or steps on
    // cobwebs.
    seededDeathApplyGhostFade(player, true);

    // Check to see if the debuff is over.
    if (
      v.run.debuffEndFrame === null ||
      isBeforeRenderFrame(v.run.debuffEndFrame)
    ) {
      return;
    }

    setSeededDeathState(SeededDeathState.DISABLED);
    v.run.debuffEndFrame = null;

    seededDeathDebuffOff(player);
    player.AnimateHappy();
    if (isJacobOrEsau(player)) {
      const twin = player.GetOtherTwin();
      if (twin !== undefined) {
        seededDeathDebuffOff(twin);
        twin.AnimateHappy();
      }
    }
  }

  checkTakingDevilItem(): void {
    const devilRoomDeals = getEffectiveDevilDeals();
    const gameFrameCount = game.GetFrameCount();

    if (devilRoomDeals !== v.run.devilRoomDeals) {
      v.run.devilRoomDeals = devilRoomDeals;
      v.run.frameOfLastDevilDeal = gameFrameCount;
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.checkFetalPosition();
    this.checkDrawTimer();
  }

  checkFetalPosition(): void {
    if (v.run.state !== SeededDeathState.FETAL_POSITION) {
      return;
    }

    const player = Isaac.GetPlayer();
    const sprite = player.GetSprite();

    if (sprite.IsPlaying("AppearVanilla")) {
      return;
    }

    setSeededDeathState(SeededDeathState.GHOST_FORM);
    mod.enableAllInputs(SEEDED_DEATH_FEATURE_NAME);

    // - Since Keeper only has one coin container, he gets a bonus usage of Holy Card. We grant it
    //   here so that it does not cancel the "AppearVanilla" animation.
    // - We also grant a Holy Card effect to Tainted Lost.
    if (isKeeper(player) || isCharacter(player, PlayerType.LOST_B)) {
      player.UseCard(CardType.HOLY);
    }
  }

  checkDrawTimer(): void {
    if (v.run.debuffEndFrame === null) {
      return;
    }

    const renderFrameCount = Isaac.GetFrameCount();

    const remainingFrames = v.run.debuffEndFrame - renderFrameCount;
    const seconds = remainingFrames / RENDER_FRAMES_PER_SECOND;

    let startingX = SEEDED_DEATH_TIMER_STARTING_X;
    const startingY = SEEDED_DEATH_TIMER_STARTING_Y;

    if (onSeason(2)) {
      startingX += SEEDED_DEATH_TIMER_SEASON_OFFSET_X;
    }

    timerDraw(TimerType.SEEDED_DEATH, seconds, startingX, startingY);
  }

  /**
   * If a player triggers seeded death while using Mega Blast, it will continue to fire once they
   * revive, so we need to manually stop it from firing. There is no way in the API to properly stop
   * a Mega Blast while it is currently going, so as a workaround, we remove all
   * `LaserVariant.GIANT_RED` lasers spawned by the player upon initialization.
   */
  // 47
  @Callback(ModCallback.POST_LASER_INIT, LaserVariant.GIANT_RED)
  postLaserInit(laser: EntityLaser): void {
    if (laser.SpawnerEntity === undefined) {
      return;
    }

    const player = laser.SpawnerEntity.ToPlayer();
    if (player === undefined) {
      return;
    }

    if (v.run.debuffEndFrame === null) {
      return;
    }

    laser.Remove();

    // Even though we delete the laser, it will still show up for a frame. Thus, the Mega Blast
    // laser will look like it is intermittently shooting, even though it deals no damage. Make it
    // invisible to fix this. (This also has the side effect of muting the sound effects.)
    laser.Visible = false;
  }

  /**
   * Since there is no way to stop the Mega Blast from firing, we remove the laser in the
   * `POST_LASER_INIT` callback. However, blood drops will also spawn when the laser hits a wall.
   */
  // 54, 70
  @Callback(ModCallback.POST_EFFECT_INIT, EffectVariant.BLOOD_DROP)
  postEffectInitBloodDrop(effect: EntityEffect): void {
    if (v.run.debuffEndFrame !== null) {
      effect.Remove();
    }
  }

  @CallbackCustom(
    ModCallbackCustom.POST_CUSTOM_REVIVE,
    RevivalType.SEEDED_DEATH,
  )
  postCustomReviveSeededDeath(player: EntityPlayer): void {
    const level = game.GetLevel();

    // The 1-Up animation has started playing, so we need to cancel it by playing the fetal position
    // animation again.
    playAppearAnimationAndFade(player);

    // Before the revival, use added Curse of the Unknown to hide the health UI. Now that we have
    // revived, set things back to normal.
    level.RemoveCurses(LevelCurse.UNKNOWN);

    setSeededDeathState(SeededDeathState.FETAL_POSITION);
  }

  @CallbackCustom(ModCallbackCustom.POST_FLIP)
  postFlip(player: EntityPlayer): void {
    if (v.run.state !== SeededDeathState.GHOST_FORM) {
      return;
    }

    // If Tainted Lazarus clears a room while in ghost form, he will switch to other Lazarus.
    // Prevent this from happening by switching back. If we do the switch now, Tainted Lazarus will
    // enter a bugged state where he has a very fast movement speed. Mark to do the switch a frame
    // from now.
    if (v.run.switchingBackToGhostLazarus) {
      v.run.switchingBackToGhostLazarus = false;

      // Flipping back from the other Lazarus will remove the seeded death fade, so we have to
      // reapply it.
      seededDeathApplyGhostFade(player, true);
    } else {
      mod.runNextGameFrame(() => {
        v.run.switchingBackToGhostLazarus = true;
        useActiveItemTemp(player, CollectibleType.FLIP);
      });
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.waitingForPostCustomRevive();
    this.ghostForm();
  }

  waitingForPostCustomRevive(): void {
    if (v.run.state !== SeededDeathState.WAITING_FOR_POST_CUSTOM_REVIVE) {
      return;
    }

    if (v.run.dyingPlayerIndex === null) {
      return;
    }

    const player = getPlayerFromIndex(v.run.dyingPlayerIndex);
    if (player === undefined) {
      return;
    }

    // It is possible to perform a room transition before the player has actually died (e.g. if they
    // die via running into a Curse Room door at full speed). However, we don't need to handle this
    // case, since the death animation will happen immediately after the new room is entered (and
    // during this time, the player is not able to move).
    if (player.HasCollectible(CollectibleType.ONE_UP)) {
      return;
    }

    playAppearAnimationAndFade(player);

    seededDeathDebuffOn(player);
    const renderFrameCount = Isaac.GetFrameCount();
    v.run.debuffEndFrame = renderFrameCount + SEEDED_DEATH_DEBUFF_RENDER_FRAMES;
  }

  ghostForm(): void {
    if (v.run.state !== SeededDeathState.GHOST_FORM) {
      return;
    }

    this.removeSpikesInSacrificeRoom();
    seededDeathSetCheckpointCollision(false);
  }

  /** Prevent people from abusing the death mechanic to use a Sacrifice Room. */
  removeSpikesInSacrificeRoom(): void {
    const room = game.GetRoom();
    const player = Isaac.GetPlayer();

    if (!inRoomType(RoomType.SACRIFICE)) {
      return;
    }

    const spikes = room.GetGridEntity(GRID_INDEX_CENTER_OF_1X1_ROOM);
    if (spikes !== undefined) {
      removeGridEntity(spikes, false);
    }

    player.AnimateSad();
    if (isJacobOrEsau(player)) {
      const twin = player.GetOtherTwin();
      if (twin !== undefined) {
        twin.AnimateSad();
      }
    }
  }

  @CallbackCustom(ModCallbackCustom.PRE_CUSTOM_REVIVE)
  preCustomRevive(player: EntityPlayer): int | undefined {
    if (!this.shouldSeededDeathRevive(player)) {
      return undefined;
    }

    this.preRevivalDeathAnimation(player);
    return RevivalType.SEEDED_DEATH;
  }

  shouldSeededDeathRevive(player: EntityPlayer): boolean {
    // Do not revive the player if they took a devil deal within the past few seconds. (We cannot
    // use the `DamageFlag.DAMAGE_DEVIL` to determine this because the player could have taken a
    // devil deal and died to a fire / spikes / etc.). In order to reduce false positives, we can
    // safely ignore characters that cannot die on taking a devil deal.
    if (
      v.run.frameOfLastDevilDeal !== null &&
      onOrBeforeGameFrame(
        v.run.frameOfLastDevilDeal + DEVIL_DEAL_BUFFER_GAME_FRAMES,
      ) &&
      this.canCharacterDieFromTakingADevilDeal(player)
    ) {
      return false;
    }

    // Do not revive the player if they are trying to get a "free" item from a particular special
    // room.
    if (inRoomType(RoomType.SACRIFICE, RoomType.BOSS_RUSH)) {
      return false;
    }

    // Do not revive the player in The Beast room. Handling this special case would be too
    // complicated and the player would probably lose the race anyway.
    if (inBeastRoom()) {
      return false;
    }

    return true;
  }

  canCharacterDieFromTakingADevilDeal(player: EntityPlayer): boolean {
    const character = player.GetPlayerType();
    return !characterCanTakeFreeDevilDeals(character) && !isKeeper(player);
  }

  preRevivalDeathAnimation(player: EntityPlayer): void {
    const level = game.GetLevel();
    const playerIndex = getPlayerIndex(player);

    this.dropEverything(player);
    if (isJacobOrEsau(player)) {
      const twin = player.GetOtherTwin();
      if (twin !== undefined) {
        this.dropEverything(player);
      }
    }

    setSeededDeathState(SeededDeathState.WAITING_FOR_POST_CUSTOM_REVIVE);
    v.run.dyingPlayerIndex = playerIndex;

    // The custom revive works by awarding a 1-Up, which is confusing. Thus, hide the health UI with
    // Curse of the Unknown for the duration of the revive.
    level.AddCurse(LevelCurse.UNKNOWN, false);
  }

  dropEverything(player: EntityPlayer): void {
    for (const pocketItemSlot of getEnumValues(PocketItemSlot)) {
      const cardType = player.GetCard(pocketItemSlot);
      const pillColor = player.GetPill(pocketItemSlot);
      if (cardType === CardType.NULL && pillColor === PillColor.NULL) {
        continue;
      }

      const position = findFreePosition(player.Position);
      player.DropPocketItem(pocketItemSlot, position);
    }

    for (const trinketSlot of getEnumValues(TrinketSlot)) {
      const trinketType = player.GetTrinket(trinketSlot);
      if (trinketType === TrinketType.NULL) {
        continue;
      }

      if (trinketType === TrinketType.PERFECTION) {
        // In the special case of the Perfection trinket, it should be deleted instead of dropped.
        player.TryRemoveTrinket(TrinketType.PERFECTION);
      } else {
        const position = findFreePosition(player.Position);
        player.DropTrinket(position, true);
      }
    }
  }
}

function playAppearAnimationAndFade(player: EntityPlayer) {
  mod.disableAllInputs(SEEDED_DEATH_FEATURE_NAME);
  seededDeathApplyGhostFade(player, true);

  // Play the animation where Isaac lies in the fetal position.
  player.PlayExtraAnimation("AppearVanilla");
  if (isJacobOrEsau(player)) {
    const twin = player.GetOtherTwin();
    if (twin !== undefined) {
      twin.PlayExtraAnimation("AppearVanilla");
      seededDeathDebuffOn(twin);
    }
  }
}
