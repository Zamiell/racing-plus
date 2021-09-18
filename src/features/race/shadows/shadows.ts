// In seeded races, the silhouettes of other races are drawn onto the screen
// This is accomplished via UDP datagrams that are sent to the client, and then to the server

/*

pack/unpack reference:

- "b" a signed char, "B" an unsigned char
- "h" a signed short (2 bytes), "H" an unsigned short (2 bytes)
- "i" a signed int (4 bytes), "I" an unsigned int (4 bytes)
- "l" a signed long (8 bytes), "L" an unsigned long (8 bytes)
- "f" a float (4 bytes), "d" a double (8 bytes)
- "s" a zero-terminated string
- "cn" a sequence of exactly n chars corresponding to a single Lua string

*/

import { getRoomIndex, saveDataManager } from "isaacscript-common";
import { ISAAC_FRAMES_PER_SECOND } from "../../../constants";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { isSlideAnimationActive } from "../../util/detectSlideAnimation";
import * as socket from "../socket";
import RacerStatus from "../types/RacerStatus";
import RaceStatus from "../types/RaceStatus";
import * as struct from "./struct";

interface ShadowData {
  userID: int;
  x: float;
  y: float;
  stage: int;
  roomIndex: int;
  character: PlayerType;
  animation: string;
  animationFrame: int;
  overlayAnimation: string;
  overlayAnimationFrame: int;
  frameUpdated: int;
}

interface ShadowMessage {
  raceID: int;
  userID: int;
  x: float;
  y: float;
  stage: int;
  roomIndex: int;
  character: PlayerType;
  animation: string;
  animationFrame: int;
  overlayAnimation: string;
  overlayAnimationFrame: int;
}

const BEACON_INTERVAL = 10 * ISAAC_FRAMES_PER_SECOND;
const BEACON_FIELDS = ["raceID", "userID", "message"];
const BEACON_DATA_FORMAT = "IIc5";

const SHADOW_FIELDS = [
  "raceID",
  "userID",
  "x",
  "y",
  "stage",
  "roomIndex",
  "character",
  "animation",
  "animationFrame",
  "overlayAnimation",
  "overlayAnimationFrame",
];
const SHADOW_DATA_FORMAT = "IIffIIIc20Ic20I";

const CHARACTER_LAYER_ID = 0;
const DEFAULT_ANIMATION = "WalkDown";
const DEFAULT_OVERLAY_ANIMATION = "HeadDown";
const FADED_COLOR = Color(1, 1, 1, 0.075, 0, 0, 0);
const OVERLAY_ANIMATIONS = ["HeadLeft", "HeadUp", "HeadRight", "HeadDown"];

const lastBeaconFrame: int | null = null;

/** Indexed by user ID. */
const spriteMap = new Map<int, Sprite>();
const spriteCharacterMap = new Map<int, PlayerType>();

const v = {
  run: {
    /** Indexed by user ID. */
    shadows: new Map<int, ShadowData>(),
  },
};

export function init(): void {
  saveDataManager("shadows", v);
}

export function postRender(): void {
  if (!shadowsEnabled()) {
    return;
  }

  sendBeacon();
  sendShadow();
  getShadows();
  drawShadows();
}

function shadowsEnabled() {
  return (
    config.shadows &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    (g.race.myStatus === RacerStatus.RACING ||
      g.race.myStatus === RacerStatus.FINISHED ||
      g.race.myStatus === RacerStatus.QUIT)
  );
}

function sendBeacon() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (
    lastBeaconFrame !== null &&
    isaacFrameCount < lastBeaconFrame + BEACON_INTERVAL
  ) {
    return;
  }

  const structObject = {
    raceID: g.race.raceID,
    userID: g.race.userID,
    message: "HELLO",
  };

  const structData: unknown[] = [];
  for (const field of BEACON_FIELDS) {
    const key = field as keyof typeof structObject;
    const fieldData = structObject[key];
    structData.push(fieldData);
  }

  const packedData = struct.pack(BEACON_DATA_FORMAT, table.unpack(structData));
  socket.sendUDP(packedData);
}

function sendShadow() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (isaacFrameCount % 2 === 0) {
    return;
  }

  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  const animationFrame = sprite.GetFrame();
  const overlayAnimation = getOverlayAnimation(sprite);
  const overlayAnimationFrame = sprite.GetOverlayFrame();
  const roomIndex = getRoomIndex();

  const structObject: ShadowMessage = {
    raceID: g.race.raceID,
    userID: g.race.userID,
    x: player.Position.X,
    y: player.Position.Y,
    stage,
    roomIndex,
    character,
    animation,
    animationFrame,
    overlayAnimation,
    overlayAnimationFrame,
  };

  const structData: unknown[] = [];
  for (const field of SHADOW_FIELDS) {
    const key = field as keyof typeof structObject;
    const fieldData = structObject[key];
    structData.push(fieldData);
  }

  const packedData = struct.pack(SHADOW_DATA_FORMAT, table.unpack(structData));
  socket.sendUDP(packedData);
}

function getOverlayAnimation(sprite: Sprite) {
  for (const overlayAnimation of OVERLAY_ANIMATIONS) {
    if (sprite.IsOverlayPlaying(overlayAnimation)) {
      return overlayAnimation;
    }
  }

  return DEFAULT_OVERLAY_ANIMATION;
}

function getShadows() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rawData = socket.readUDP();
    if (rawData === null) {
      break;
    }

    const shadowMessage = unpackShadowMessage(rawData);
    updateShadow(shadowMessage);
  }
}

function unpackShadowMessage(rawData: string) {
  const dataArray = [...struct.unpack(SHADOW_DATA_FORMAT, rawData)];
  const shadowMessage: Record<string, unknown> = {};
  for (let i = 0; i < SHADOW_FIELDS.length; i++) {
    const field = SHADOW_FIELDS[i];
    let fieldData = dataArray[i];
    if (type(fieldData) === "string") {
      fieldData = (fieldData as string).trim();
    }
    shadowMessage[field] = fieldData;
  }

  return shadowMessage as unknown as ShadowMessage;
}

function updateShadow(shadowMessage: ShadowMessage) {
  if (shadowMessage.raceID !== g.race.raceID) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();

  const shadowData: ShadowData = {
    userID: shadowMessage.userID,
    x: shadowMessage.x,
    y: shadowMessage.y,
    stage: shadowMessage.stage,
    roomIndex: shadowMessage.roomIndex,
    character: shadowMessage.character,
    animation: shadowMessage.animation,
    animationFrame: shadowMessage.animationFrame,
    overlayAnimation: shadowMessage.overlayAnimation,
    overlayAnimationFrame: shadowMessage.overlayAnimationFrame,
    frameUpdated: isaacFrameCount,
  };
  v.run.shadows.set(shadowMessage.userID, shadowData);
}

function drawShadows() {
  if (isSlideAnimationActive()) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const roomIndex = getRoomIndex();

  for (const shadowData of v.run.shadows.values()) {
    const framesSinceLastUpdate = isaacFrameCount - shadowData.frameUpdated;
    if (framesSinceLastUpdate > 1 * ISAAC_FRAMES_PER_SECOND) {
      continue;
    }

    if (shadowData.roomIndex !== roomIndex) {
      continue;
    }

    let sprite = spriteMap.get(shadowData.userID);
    if (sprite === undefined) {
      sprite = Sprite();
      sprite.Load("gfx/001.000_Player.anm2", true);
      sprite.Play(DEFAULT_ANIMATION, true);
      sprite.PlayOverlay(DEFAULT_OVERLAY_ANIMATION, true);
      sprite.Color = FADED_COLOR;
      spriteMap.set(shadowData.userID, sprite);
    }

    let spriteCharacter = spriteCharacterMap.get(shadowData.userID);
    if (spriteCharacter === undefined) {
      spriteCharacter = -1;
    }

    if (spriteCharacter !== shadowData.character) {
      const characterPNG = getCharacterPNG(shadowData.character);
      sprite.ReplaceSpritesheet(CHARACTER_LAYER_ID, characterPNG);
      spriteCharacterMap.set(shadowData.userID, shadowData.character);
    }

    const positionGame = Vector(shadowData.x, shadowData.y);
    const position = Isaac.WorldToRenderPosition(positionGame);
    sprite.Render(position, Vector.Zero, Vector.Zero);
  }
}

function getCharacterPNG(character: PlayerType) {
  switch (character) {
    // 0
    case PlayerType.PLAYER_ISAAC: {
      return "characters/costumes/character_001_isaac.png";
    }

    // 1
    case PlayerType.PLAYER_MAGDALENA: {
      return "characters/costumes/character_002_magdalene.png";
    }

    // 2
    case PlayerType.PLAYER_CAIN: {
      return "characters/costumes/character_003_cain.png";
    }

    // 3
    case PlayerType.PLAYER_JUDAS: {
      return "characters/costumes/character_004_judas.png";
    }

    // 4
    case PlayerType.PLAYER_XXX: {
      return "characters/costumes/character_006_bluebaby.png";
    }

    // 5
    case PlayerType.PLAYER_EVE: {
      return "characters/costumes/character_005_eve.png";
    }

    // 6
    case PlayerType.PLAYER_SAMSON: {
      return "characters/costumes/character_007_samson.png";
    }

    // 7
    case PlayerType.PLAYER_AZAZEL: {
      return "characters/costumes/character_008_azazel.png";
    }

    // 8
    case PlayerType.PLAYER_LAZARUS: {
      return "characters/costumes/character_009_lazarus.png";
    }

    // 9
    case PlayerType.PLAYER_EDEN: {
      return "characters/costumes/character_009_eden.png";
    }

    // 10
    case PlayerType.PLAYER_THELOST: {
      return "characters/costumes/character_012_thelost.png";
    }

    // 11
    case PlayerType.PLAYER_LAZARUS2: {
      return "characters/costumes/character_010_lazarus2.png";
    }

    // 12
    case PlayerType.PLAYER_BLACKJUDAS: {
      return "characters/costumes/character_013_blackjudas.png";
    }

    // 13
    case PlayerType.PLAYER_LILITH: {
      return "characters/costumes/character_014_lilith.png";
    }

    // 14
    case PlayerType.PLAYER_KEEPER: {
      return "characters/costumes/character_015_keeper.png";
    }

    // 15
    case PlayerType.PLAYER_APOLLYON: {
      return "characters/costumes/character_016_apollyon.png";
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      return "characters/costumes/character_017_theforgotten.png";
    }

    // 17
    case PlayerType.PLAYER_THESOUL: {
      return "characters/costumes/character_018_thesoul.png";
    }

    // 18
    case PlayerType.PLAYER_BETHANY: {
      return "characters/costumes/character_001x_bethany.png";
    }

    // 19
    case PlayerType.PLAYER_JACOB: {
      return "characters/costumes/character_002x_jacob.png";
    }

    // 20
    case PlayerType.PLAYER_ESAU: {
      return "characters/costumes/character_003x_esau.png";
    }

    // 21
    case PlayerType.PLAYER_ISAAC_B: {
      return "characters/costumes/character_001b_isaac.png";
    }

    // 22
    case PlayerType.PLAYER_MAGDALENA_B: {
      return "characters/costumes/character_002b_magdalene.png";
    }

    // 23
    case PlayerType.PLAYER_CAIN_B: {
      return "characters/costumes/character_003b_cain.png";
    }

    // 24
    case PlayerType.PLAYER_JUDAS_B: {
      return "characters/costumes/character_004b_judas.png";
    }

    // 25
    case PlayerType.PLAYER_XXX_B: {
      return "characters/costumes/character_005b_bluebaby.png";
    }

    // 26
    case PlayerType.PLAYER_EVE_B: {
      return "characters/costumes/character_006b_eve.png";
    }

    // 27
    case PlayerType.PLAYER_SAMSON_B: {
      return "characters/costumes/character_007b_samson.png";
    }

    // 28
    case PlayerType.PLAYER_AZAZEL_B: {
      return "characters/costumes/character_008b_azazel.png";
    }

    // 29
    case PlayerType.PLAYER_LAZARUS_B: {
      return "characters/costumes/character_009b_lazarus.png";
    }

    // 30
    case PlayerType.PLAYER_EDEN_B: {
      return "characters/costumes/characters/costumes/character_009_eden.png";
    }

    // 31
    case PlayerType.PLAYER_THELOST_B: {
      return "characters/costumes/character_012b_thelost.png";
    }

    // 32
    case PlayerType.PLAYER_LILITH_B: {
      return "characters/costumes/character_014b_lilith.png";
    }

    // 33
    case PlayerType.PLAYER_KEEPER_B: {
      return "characters/costumes/character_015b_keeper.png";
    }

    // 34
    case PlayerType.PLAYER_APOLLYON_B: {
      return "characters/costumes/character_016b_apollyon.png";
    }

    // 35
    case PlayerType.PLAYER_THEFORGOTTEN_B: {
      return "characters/costumes/character_016b_theforgotten.png";
    }

    // 36
    case PlayerType.PLAYER_BETHANY_B: {
      return "characters/costumes/character_018b_bethany.png";
    }

    // 37
    case PlayerType.PLAYER_JACOB_B: {
      return "characters/costumes/character_019b_jacob.png";
    }

    // 38
    case PlayerType.PLAYER_LAZARUS2_B: {
      return "characters/costumes/character_009b_lazarus2.png";
    }

    // 39
    case PlayerType.PLAYER_JACOB2_B: {
      return "characters/costumes/character_019b_jacob2.png";
    }

    // 40
    case PlayerType.PLAYER_THESOUL_B: {
      return "characters/costumes/character_017b_thesoul.png";
    }

    default: {
      return "characters/costumes/character_001_isaac.png";
    }
  }
}
