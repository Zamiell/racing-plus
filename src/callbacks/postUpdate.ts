import { ModCallback } from "isaac-typescript-definitions";
import { changeCharOrderPostUpdate } from "../features/changeCharOrder/callbacks/postUpdate";
import * as fireworks from "../features/mandatory/fireworks";
import { seededDeathPostUpdate } from "../features/mandatory/seededDeath/callbacks/postUpdate";
import * as showLevelTextOnTab from "../features/mandatory/showLevelTextOnTab";
import * as trophy from "../features/mandatory/trophy";
import * as fastBossRush from "../features/optional/bosses/fastBossRush";
import * as battery9VoltSynergy from "../features/optional/bugfix/battery9VoltSynergy";
import { extraStartingItemsPostUpdate } from "../features/optional/gameplay/extraStartingItems/callbacks/postUpdate";
import { fastClearPostUpdate } from "../features/optional/major/fastClear/callbacks/postUpdate";
import { fastTravelPostUpdate } from "../features/optional/major/fastTravel/callbacks/postUpdate";
import * as fastVanishingTwin from "../features/optional/quality/fastVanishingTwin";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import { racePostUpdate } from "../features/race/callbacks/postUpdate";
import { speedrunPostUpdate } from "../features/speedrun/callbacks/postUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  // Mandatory
  trophy.postUpdate();
  seededDeathPostUpdate();
  fireworks.postUpdate();
  showLevelTextOnTab.postUpdate();

  // Major
  racePostUpdate();
  speedrunPostUpdate();
  changeCharOrderPostUpdate();
  fastClearPostUpdate();
  fastTravelPostUpdate();

  // Bosses
  fastBossRush.postUpdate();

  // QoL
  showPills.postUpdate();
  showMaxFamiliars.postUpdate();
  fastVanishingTwin.postUpdate(); // 697

  // Gameplay
  extraStartingItemsPostUpdate();

  // Bug fixes
  battery9VoltSynergy.postUpdate();
}
