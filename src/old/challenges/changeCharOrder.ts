import { DEFAULT_COLOR, DEFAULT_KCOLOR, ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import SeasonDescription from "../types/SeasonDescription";
import { BIG_4_ITEMS, CHANGE_CHAR_ORDER_POSITIONS } from "./constants";
import { ChallengeCustom, ChangeCharOrderPhase } from "./enums";

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  if (RacingPlusData === undefined) {
    return;
  }

  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  if (
    g.changeCharOrder.createButtonsFrame !== 0 &&
    gameFrameCount >= g.changeCharOrder.createButtonsFrame
  ) {
    g.changeCharOrder.createButtonsFrame = 0;

    switch (g.changeCharOrder.phase) {
      case 2: {
        createCharacterButtons();
        break;
      }

      case 3: {
        if (g.changeCharOrder.seasonChosen === "R7S4") {
          createItemButtons();
        } else if (g.changeCharOrder.seasonChosen === "R7S6") {
          createItemBanButtonsBig4();
        }
        break;
      }

      case 4: {
        createItemBanButtonsNormal();
        break;
      }

      default: {
        Isaac.DebugString(
          `Error: The "ChangeCharOrder.PostUpdate()" function was entered with a phase of: ${g.changeCharOrder.phase}`,
        );
        break;
      }
    }
  }
}

function createCharacterButtons() {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];

  g.changeCharOrder.sprites.characters = [];
  for (const [characterID, x, y] of season.charPositions) {
    // Spawn buttons for each characters
    const pos = misc.gridToPos(x, y);
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, pos, true);

    // Spawn the character selection graphic next to the button
    const characterSprite = Sprite();
    characterSprite.Load(`gfx/custom/characters/${characterID}.anm2`, true);
    // The 5th frame is rather interesting
    characterSprite.SetFrame("Death", 5);
    // Fade the character so it looks like a ghost
    characterSprite.Color = Color(1, 1, 1, 0.5, 0, 0, 0);

    g.changeCharOrder.sprites.characters.push(characterSprite);
  }

  // In Season 6, we are not allowed to choose Eden for the first character
  if (g.changeCharOrder.seasonChosen === "R7S6") {
    const rockCoordinates = [
      [9, 0],
      [10, 0],
      [11, 0],
      [9, 1],
      [11, 1],
      [9, 2],
      [10, 2],
      [11, 2],
    ];
    for (const [x, y] of rockCoordinates) {
      const position = misc.gridToPos(x, y);
      Isaac.GridSpawn(GridEntityType.GRID_ROCK, 0, position, true);
    }
  }

  // Put the player next to the bottom door
  g.p.Position = misc.gridToPos(6, 5);
}

function createItemButtons() {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositions === undefined) {
    error("itemPositions does not exist in the season.");
  }

  // Make the sprite that shows what character we are choosing for
  g.changeCharOrder.sprites.characters = [];
  const characterSprite = Sprite();
  const characterID = g.changeCharOrder.charOrder[1];
  characterSprite.Load(`gfx/custom/characters/${characterID}.anm2`, true);
  // The 5th frame is rather interesting
  characterSprite.SetFrame("Death", 5);
  // Fade the character so that it looks like a ghost
  characterSprite.Color = Color(1, 1, 1, 0.5, 0, 0, 0);
  g.changeCharOrder.sprites.characters.push(characterSprite);

  g.changeCharOrder.sprites.items = [];
  for (const [itemOrBuildID, x, y] of season.itemPositions) {
    // Spawn buttons for the all the items
    const buttonPos = misc.gridToPos(x, y);
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, buttonPos, true);
    if (BIG_4_ITEMS.includes(itemOrBuildID)) {
      // Spawn creep for the S-Class items
      g.r.SetClear(false); // Or else the creep will instantly dissipate
      for (let i = 1; i <= 10; i++) {
        const creep = Isaac.Spawn(
          EntityType.ENTITY_EFFECT,
          EffectVariant.CREEP_RED,
          0,
          buttonPos,
          ZERO_VECTOR,
          null,
        ).ToEffect();
        if (creep !== null) {
          creep.Timeout = 1000000;
        }
      }
    }

    // Spawn the item selection graphics next to the buttons
    const itemSprite = Sprite();
    itemSprite.Load("gfx/schoolbag_item.anm2", false);
    if (itemOrBuildID < 1000) {
      // This is a single item
      const fileName = g.itemConfig.GetCollectible(itemOrBuildID).GfxFileName;
      itemSprite.ReplaceSpritesheet(0, fileName);
    } else {
      // This is a build
      itemSprite.ReplaceSpritesheet(0, `gfx/builds/${itemOrBuildID}.png`);
    }
    itemSprite.LoadGraphics();
    itemSprite.SetFrame("Default", 1);
    g.changeCharOrder.sprites.items.push(itemSprite);
  }

  // Move Isaac to the center of the room
  g.p.Position = g.r.GetCenterPos();
}

function createItemBanButtonsBig4() {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositionsBig4 === undefined) {
    error("itemPositionsBig4 does not exist in the season.");
  }

  // Delete all of the character sprites from the previous step
  g.changeCharOrder.sprites.characters = [];

  g.changeCharOrder.sprites.items = [];
  for (const [itemOrBuildID, x, y] of season.itemPositionsBig4) {
    // Spawn buttons for the all the items
    const buttonPos = misc.gridToPos(x, y);
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, buttonPos, true);

    // Spawn the item selection graphics next to the buttons
    const itemSprite = Sprite();
    itemSprite.Load("gfx/schoolbag_item.anm2", false);
    let fileName: string;
    if (itemOrBuildID < 1000) {
      // This is a single item
      fileName = g.itemConfig.GetCollectible(itemOrBuildID).GfxFileName;
    } else {
      // This is a build
      fileName = `gfx/builds/${itemOrBuildID}.png`;
    }
    itemSprite.ReplaceSpritesheet(0, fileName);
    itemSprite.LoadGraphics();
    itemSprite.SetFrame("Default", 1);
    g.changeCharOrder.sprites.items.push(itemSprite);
  }

  // Move Isaac to the center of the room
  g.p.Position = g.r.GetCenterPos();
}

function createItemBanButtonsNormal() {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositionsNormal === undefined) {
    error("itemPositions2 does not exist in the season.");
  }

  g.changeCharOrder.sprites.items = [];
  for (const [itemOrBuildID, x, y] of season.itemPositionsNormal) {
    // Spawn buttons for the all the items
    const buttonPos = misc.gridToPos(x, y);
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, buttonPos, true);

    // Spawn the item selection graphics next to the buttons
    const itemSprite = Sprite();
    itemSprite.Load("gfx/schoolbag_item.anm2", false);
    let fileName: string;
    if (itemOrBuildID < 1000) {
      // This is a single item
      fileName = g.itemConfig.GetCollectible(itemOrBuildID).GfxFileName;
    } else {
      // This is a build
      fileName = `gfx/builds/${itemOrBuildID}.png`;
    }
    itemSprite.ReplaceSpritesheet(0, fileName);
    itemSprite.LoadGraphics();
    itemSprite.SetFrame("Default", 1);
    g.changeCharOrder.sprites.items.push(itemSprite);
  }

  // Put the player next to the bottom door
  g.p.Position = misc.gridToPos(6, 5);
}

// In R+7 Season 4, remove all the S class item buttons
function removeSClassButtons(indexChosen: int) {
  // Local variables
  const gridSize = g.r.GetGridSize();
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositions === undefined) {
    error("itemPositions does not exist in the season.");
  }

  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (saveState.Type !== GridEntityType.GRID_PRESSURE_PLATE) {
        continue;
      }

      for (const [itemOrBuildID, x, y] of season.itemPositions) {
        if (BIG_4_ITEMS.includes(itemOrBuildID)) {
          const big4ItemPos = misc.gridToPos(x, y);
          if (
            gridEntity.Position.X === big4ItemPos.X &&
            gridEntity.Position.Y === big4ItemPos.Y
          ) {
            g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work
          }
        }
      }
    }
  }

  // Remove the sprites for the last 4 items
  // (but leave the one we just chose so that it stays as a number)
  for (let i = 0; i < season.itemPositions.length; i++) {
    const itemOrBuildID = season.itemPositions[i][0];
    if (BIG_4_ITEMS.includes(itemOrBuildID)) {
      if (i !== indexChosen) {
        g.changeCharOrder.sprites.items[i] = Sprite();
      }
    }
  }
}

// Called from the "CheckEntities.Grid()" function
export function checkButtonPressed(gridEntity: GridEntity): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  switch (g.changeCharOrder.phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      checkButtonPressedPhaseSeasonSelect(gridEntity);
      break;
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      checkButtonPressedPhaseCharacterSelect(gridEntity);
      break;
    }

    case ChangeCharOrderPhase.ITEM_SELECT: {
      if (g.changeCharOrder.seasonChosen === "R7S4") {
        checkButtonPressedPhaseItemSelect(gridEntity);
      } else if (g.changeCharOrder.seasonChosen === "R7S6") {
        checkButtonPressedPhaseItemSelectBanBig4(gridEntity);
      }
      break;
    }

    case ChangeCharOrderPhase.ITEM_SELECT_2: {
      // This phase is only used in Season 6
      checkButtonPressedPhaseItemSelectBanNormal(gridEntity);
      break;
    }

    default: {
      break;
    }
  }
}

// Phase 1 corresponds to when the season buttons are present
function checkButtonPressedPhaseSeasonSelect(gridEntity: GridEntity) {
  for (const [key, position] of Object.entries(CHANGE_CHAR_ORDER_POSITIONS)) {
    const buttonPos = misc.gridToPos(position.X, position.Y);
    if (
      gridEntity.GetSaveState().State === 3 && // Pressed
      gridEntity.Position.X === buttonPos.X &&
      gridEntity.Position.Y === buttonPos.Y
    ) {
      seasonButtonPressed(key);
      return;
    }
  }
}

function seasonButtonPressed(seasonChosen: string) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  g.changeCharOrder.phase = 2;
  g.changeCharOrder.seasonChosen = seasonChosen;
  removeAllRoomButtons();

  // Delete all of the season sprites
  g.changeCharOrder.sprites.seasons = new Map<string, Sprite>();

  // Mark to create new buttons (for the characters) on the next frame
  g.changeCharOrder.createButtonsFrame = gameFrameCount + 1;
}

function checkButtonPressedPhaseCharacterSelect(gridEntity: GridEntity) {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];

  for (let i = 0; i < season.charPositions.length; i++) {
    const [, x, y] = season.charPositions[i];
    const posButton = misc.gridToPos(x, y);
    if (
      gridEntity.GetSaveState().State === 3 &&
      gridEntity.VarData === 0 && // We set it to 1 to mark that we have pressed it
      gridEntity.Position.X === posButton.X &&
      gridEntity.Position.Y === posButton.Y
    ) {
      characterButtonPressed(gridEntity, i);
    }
  }
}

function characterButtonPressed(gridEntity: GridEntity, i: int) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  const characterID = season.charPositions[i][0];

  // Check to see if we chose Eden first on season 6
  if (
    g.changeCharOrder.seasonChosen === "R7S6" &&
    g.changeCharOrder.charOrder.length === 0
  ) {
    if (characterID === PlayerType.PLAYER_EDEN) {
      g.p.Kill();
      Isaac.DebugString(
        "Cheating detected (attempted to choose Eden first). Killing the player.",
      );
      return;
    }

    // Break the rocks so that they can choose Eden for the second character and beyond
    const destroyRock = (gridIndex: int) => {
      g.r.RemoveGridEntity(gridIndex, 0, false); // gridEntity.Destroy() does not work
    };
    destroyRock(25);
    destroyRock(26);
    destroyRock(27);
    destroyRock(40);
    destroyRock(42);
    destroyRock(55);
    destroyRock(56);
    destroyRock(57);
  }

  // Mark that we have pressed this button
  gridEntity.VarData = 1;
  g.changeCharOrder.charOrder.push(characterID);

  // Change the graphic to that of a number
  g.changeCharOrder.sprites.characters[i].Load("gfx/timer/timer.anm2", true);
  g.changeCharOrder.sprites.characters[i].SetFrame(
    "Default",
    g.changeCharOrder.charOrder.length,
  );
  g.changeCharOrder.sprites.characters[i].Color = DEFAULT_COLOR; // Remove the fade

  // Check to see if this is our last character
  if (g.changeCharOrder.charOrder.length === season.charPositions.length) {
    if (
      g.changeCharOrder.seasonChosen === "R7S4" ||
      g.changeCharOrder.seasonChosen === "R7S6"
    ) {
      // In R+7 Season 4/6, now we have to choose our items
      g.changeCharOrder.phase = ChangeCharOrderPhase.ITEM_SELECT;
      removeAllRoomButtons();

      // Mark to create new buttons (for the items) on the next frame
      g.changeCharOrder.createButtonsFrame = gameFrameCount + 1;
    } else {
      // We are done, so write the changes to the Racing+ Data mod's "save#.dat" file
      RacingPlusData.Set(
        `charOrder-${g.changeCharOrder.seasonChosen}`,
        g.changeCharOrder.charOrder,
      );

      g.g.Fadeout(0.05, FadeoutTarget.FADEOUT_MAIN_MENU);
    }
  }
}

function checkButtonPressedPhaseItemSelect(gridEntity: GridEntity) {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositions === undefined) {
    error("itemPositions does not exist in the season.");
  }

  for (let i = 0; i < season.itemPositions.length; i++) {
    const [, x, y] = season.itemPositions[i];
    const posButton = misc.gridToPos(x, y);
    if (
      gridEntity.GetSaveState().State === 3 &&
      gridEntity.VarData === 0 && // We set it to 1 to mark that we have pressed it
      gridEntity.Position.X === posButton.X &&
      gridEntity.Position.Y === posButton.Y
    ) {
      itemButtonPressed(gridEntity, i);
    }
  }
}

function itemButtonPressed(gridEntity: GridEntity, i: int) {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositions === undefined) {
    error("itemPositions does not exist in the season.");
  }
  const itemID = season.itemPositions[i][0];

  // Mark that we have pressed this button
  gridEntity.VarData = 1;
  g.changeCharOrder.itemOrder.push(itemID);

  if (g.changeCharOrder.itemOrder.length === season.charPositions.length) {
    // They finished choosing all the items (one for each character)
    itemButtonsFinished();
  }

  // Change the graphic to that of a number
  g.changeCharOrder.sprites.items[i].Load("gfx/timer/timer.anm2", true);
  g.changeCharOrder.sprites.items[i].SetFrame(
    "Default",
    g.changeCharOrder.itemOrder.length,
  );

  // Change the player sprite
  const characterNum = g.changeCharOrder.charOrder.length + 1;
  const characterSprite = g.changeCharOrder.sprites.characters[0];
  characterSprite.Load(`gfx/custom/characters/${characterNum}.anm2`, true);
  characterSprite.SetFrame("Death", 5);
  characterSprite.Color = Color(1, 1, 1, 0.5, 0, 0, 0); // Fade the character so it looks like a ghost

  if (BIG_4_ITEMS.includes(itemID)) {
    // They touched an S class item, and are only allowed to choose one of those
    removeSClassButtons(i);
  }
}

function itemButtonsFinished() {
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }

  // Check to see if they cheated
  // (it is possible to push two buttons at once in order to get two "big 4" items)
  let numBig4Items = 0;
  for (const chosenItemID of g.changeCharOrder.itemOrder) {
    if (BIG_4_ITEMS.includes(chosenItemID)) {
      numBig4Items += 1;
    }
  }
  if (numBig4Items > 1) {
    g.p.Kill();
    Isaac.DebugString(
      "Cheating detected (attempt to choose two big 4 items). Killing the player.",
    );
    return;
  }

  // Concatenate the character order and the items chosen into one big table
  const charOrder: int[] = [];
  charOrder.concat(g.changeCharOrder.charOrder);
  charOrder.concat(g.changeCharOrder.itemOrder);

  // We are done, so write the changes to the Racing+ Data mod's "save#.dat" file
  RacingPlusData.Set(`charOrder-${g.changeCharOrder.seasonChosen}`, charOrder);

  g.g.Fadeout(0.05, FadeoutTarget.FADEOUT_MAIN_MENU);
}

function checkButtonPressedPhaseItemSelectBanBig4(gridEntity: GridEntity) {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositionsBig4 === undefined) {
    error("itemPositionsBig4 does not exist in the season.");
  }

  for (let i = 0; i < season.itemPositionsBig4.length; i++) {
    const [, x, y] = season.itemPositionsBig4[i];
    const posButton = misc.gridToPos(x, y);
    if (
      gridEntity.GetSaveState().State === 3 &&
      gridEntity.VarData === 0 && // We set it to 1 to mark that we have pressed it
      gridEntity.Position.X === posButton.X &&
      gridEntity.Position.Y === posButton.Y
    ) {
      itemBig4ButtonPressed(gridEntity, i);
    }
  }
}

function itemBig4ButtonPressed(gridEntity: GridEntity, i: int) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositionsBig4 === undefined) {
    error("itemPositionsBig4 does not exist in the season.");
  }
  const itemID = season.itemPositionsBig4[i][0];

  // Mark that we have pressed this button
  gridEntity.VarData = 1;
  g.changeCharOrder.itemOrder.push(itemID);

  if (g.changeCharOrder.itemOrder.length === 1) {
    // They finished banning a big 4 item
    // Concatenate the character order and the items chosen into one big table
    const charOrder: int[] = [];
    charOrder.concat(g.changeCharOrder.charOrder);
    charOrder.concat(g.changeCharOrder.itemOrder);
    g.changeCharOrder.charOrder = charOrder;

    // Reset the items chosen
    g.changeCharOrder.itemOrder = [];

    // Now we have to ban other items
    g.changeCharOrder.phase = ChangeCharOrderPhase.ITEM_SELECT_2;
    removeAllRoomButtons();

    // Mark to create new buttons (for the items) on the next frame
    g.changeCharOrder.createButtonsFrame = gameFrameCount + 1;
  }
}

function checkButtonPressedPhaseItemSelectBanNormal(gridEntity: GridEntity) {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositionsNormal === undefined) {
    error("itemPositionsNormal does not exist in the season.");
  }

  for (let i = 0; i < season.itemPositionsNormal.length; i++) {
    const [, x, y] = season.itemPositionsNormal[i];
    const posButton = misc.gridToPos(x, y);
    if (
      gridEntity.GetSaveState().State === 3 &&
      gridEntity.VarData === 0 && // We set it to 1 to mark that we have pressed it
      gridEntity.Position.X === posButton.X &&
      gridEntity.Position.Y === posButton.Y
    ) {
      itemNormalButtonPressed(gridEntity, i);
    }
  }
}

function itemNormalButtonPressed(gridEntity: GridEntity, i: int) {
  // Local variables
  if (g.changeCharOrder.seasonChosen === null) {
    error("seasonChosen is nil.");
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];
  if (season.itemPositionsBig4 === undefined) {
    error("itemPositionsBig4 does not exist in the season.");
  }
  const itemID = season.itemPositionsBig4[i][0];

  // Mark that we have pressed this button
  gridEntity.VarData = 1;
  g.changeCharOrder.itemOrder.push(itemID);

  if (g.changeCharOrder.itemOrder.length === season.itemBans) {
    // Concatenate the previous data and the new items chosen into one big table
    const charOrder: int[] = [];
    charOrder.concat(g.changeCharOrder.charOrder);
    charOrder.concat(g.changeCharOrder.itemOrder);

    // We are done, so write the changes to the Racing+ Data mod's "save#.dat" file
    RacingPlusData.Set(
      `charOrder-${g.changeCharOrder.seasonChosen}`,
      charOrder,
    );

    g.g.Fadeout(0.05, FadeoutTarget.FADEOUT_MAIN_MENU);
  }

  // Change the graphic to that of a number
  g.changeCharOrder.sprites.items[i].Load("gfx/timer/timer.anm2", true);
  g.changeCharOrder.sprites.items[i].SetFrame(
    "Default",
    g.changeCharOrder.itemOrder.length,
  );
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  if (RacingPlusData === undefined) {
    return;
  }

  // Disable the controls or else the player will be able to move around while the screen is still
  // black
  if (gameFrameCount < 1) {
    g.p.ControlsEnabled = false;
  } else {
    g.p.ControlsEnabled = true;
  }

  // Render the current choosing activity
  const posActivityGame = misc.gridToPos(6, 6);
  const posActivity = Isaac.WorldToRenderPosition(posActivityGame);
  posActivity.Y -= 15;
  const text = getTextForCurrentActivity(g.changeCharOrder.phase);
  const length = g.font.GetStringWidthUTF8(text);
  g.font.DrawString(
    text,
    posActivity.X - length / 2,
    posActivity.Y,
    DEFAULT_KCOLOR,
    0,
    true,
  );

  // Render the button sprites
  for (const [seasonAbbreviation, seasonSprite] of g.changeCharOrder.sprites
    .seasons) {
    const position = CHANGE_CHAR_ORDER_POSITIONS[seasonAbbreviation];
    const posButton = misc.gridToPos(position.X, position.Y);
    const posRender = Isaac.WorldToRenderPosition(posButton);
    seasonSprite.RenderLayer(0, posRender);
  }

  if (g.changeCharOrder.seasonChosen === null) {
    return;
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[g.changeCharOrder.seasonChosen];

  // Render the character sprites
  for (let i = 0; i < g.changeCharOrder.sprites.characters.length; i++) {
    const characterSprite = g.changeCharOrder.sprites.characters[i];
    const [, x, y] = season.charPositions[i];

    let posCharGame;
    if (g.changeCharOrder.sprites.characters.length === 1) {
      posCharGame = misc.gridToPos(6, 5); // The bottom-center of the room
    } else {
      posCharGame = misc.gridToPos(x, y - 1); // We want it to be one square above the button
    }

    const posChar = Isaac.WorldToRenderPosition(posCharGame);
    posChar.Y += 10; // Nudge it a bit upwards to make it look better

    characterSprite.Render(posChar, ZERO_VECTOR, ZERO_VECTOR);
  }

  // Render the item sprites
  for (let i = 0; i < g.changeCharOrder.sprites.items.length; i++) {
    const itemSprite = g.changeCharOrder.sprites.items[i];
    const [x, y] = getItemSpriteXY(season, i);
    const posItemGame = misc.gridToPos(x, y - 1);
    const posItem = Isaac.WorldToRenderPosition(posItemGame);
    itemSprite.Render(posItem, ZERO_VECTOR, ZERO_VECTOR);
  }
}

function getTextForCurrentActivity(phase: ChangeCharOrderPhase) {
  switch (phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      return "Choose your season";
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      return "Choose your character order";
    }

    case ChangeCharOrderPhase.ITEM_SELECT: {
      if (g.changeCharOrder.seasonChosen === "R7S4") {
        return "Choose your starting items";
      }
      if (g.changeCharOrder.seasonChosen === "R7S6") {
        return "Choose a Big 4 item to ban";
      }
      return "Unknown";
    }

    case ChangeCharOrderPhase.ITEM_SELECT_2: {
      const itemBans = CHANGE_CHAR_ORDER_POSITIONS.R7S6.itemBans;
      if (itemBans === undefined) {
        return "Unknown";
      }
      return `Choose ${itemBans} items to ban from the starting pool`;
    }

    default: {
      return "Unknown";
    }
  }
}

function getItemSpriteXY(season: SeasonDescription, i: int): [int, int] {
  switch (g.changeCharOrder.seasonChosen) {
    case "R7S4": {
      if (season.itemPositions === undefined) {
        error("itemPositions does not exist in the season.");
      }
      const [, x, y] = season.itemPositions[i];
      return [x, y];
    }

    case "R7S6": {
      switch (g.changeCharOrder.phase) {
        case ChangeCharOrderPhase.ITEM_SELECT: {
          if (season.itemPositionsBig4 === undefined) {
            error("itemPositionsBig4 does not exist in the season.");
          }
          const [, x, y] = season.itemPositionsBig4[i];
          return [x, y];
        }

        case ChangeCharOrderPhase.ITEM_SELECT_2: {
          if (season.itemPositionsNormal === undefined) {
            error("itemPositionsNormal does not exist in the season.");
          }
          const [, x, y] = season.itemPositionsNormal[i];
          return [x, y];
        }

        default: {
          error("Failed to get the x and y values for an item sprite in R7S6.");
          return [0, 0];
        }
      }
    }

    default: {
      error("Failed to get the x and y values for an item sprite.");
      return [0, 0];
    }
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }
  if (RacingPlusData === null) {
    return;
  }

  if (g.run.roomsEntered === 1) {
    Isaac.ExecuteCommand("stage 1a"); // The Cellar is the cleanest floor
    g.run.goingToDebugRoom = true;
    Isaac.ExecuteCommand("goto d.0"); // We do more things in the next "PostNewRoom" callback
    return;
  }
  if (g.run.roomsEntered !== 2) {
    return;
  }

  // Remove all enemies
  for (const entity of Isaac.GetRoomEntities()) {
    const npc = entity.ToNPC();
    if (npc !== null) {
      entity.Remove();
    }
  }
  g.r.SetClear(true);

  // We want to trap the player in the room, so delete all 4 doors
  for (let i = 0; i < 3; i++) {
    g.r.RemoveDoor(i);
  }

  // Put the player next to the bottom door
  g.p.Position = misc.gridToPos(6, 5);

  // Remove the D6
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);

  // Remove the bomb
  g.p.AddBombs(-1);

  // Give Isaac's some speed
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  g.p.RemoveCostume(
    g.itemConfig.GetCollectible(CollectibleType.COLLECTIBLE_BELT),
  );

  // Get rid of the HUD
  g.seeds.AddSeedEffect(SeedEffect.SEED_NO_HUD);

  // Reset variables relating to the room && the graphics
  g.changeCharOrder.phase = 1;
  g.changeCharOrder.seasonChosen = null;
  g.changeCharOrder.createButtonsFrame = 0;
  g.changeCharOrder.charOrder = [];
  g.changeCharOrder.itemOrder = [];
  g.changeCharOrder.sprites = {
    seasons: new Map<string, Sprite>(),
    characters: [],
    items: [],
  };

  // Spawn buttons for each type of speedrun
  // (and a graphic over each button)
  for (const [key, position] of Object.entries(CHANGE_CHAR_ORDER_POSITIONS)) {
    if (position.hidden !== undefined) {
      // This is a beta season that should not be shown quite yet
      continue;
    }

    const pos = misc.gridToPos(position.X, position.Y);
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, pos, true);

    const seasonSprite = Sprite();
    seasonSprite.Load(`gfx/speedrun/button-${key}.anm2`, true);
    seasonSprite.SetFrame("Default", 0);
    g.changeCharOrder.sprites.seasons.set(key, seasonSprite);
  }
}

function removeAllRoomButtons() {
  const gridSize = g.r.GetGridSize();
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (saveState.Type === GridEntityType.GRID_PRESSURE_PLATE) {
        g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work
      }
    }
  }
}
