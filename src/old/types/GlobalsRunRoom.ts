import { ZERO_VECTOR } from "../constants";
import BlackHeartNPC from "./BlackHeartNPC";
import { GlobinDescription } from "./GlobinDescription";
import HopperDescription from "./HopperDescription";
import LightDescription from "./LightDescription";

export default class GlobalsRunRoom {
  fastCleared = false;
  currentGlobins = new Map<int, GlobinDescription>(); // Used for softlock prevention
  currentLilHaunts = []; // Used to delete invulnerability frames // TODO
  currentHoppers = new Map<int, HopperDescription>(); // Used to prevent softlocks
  usedStrength = false;
  usedStrengthChar = 0;
  handsDelay = 0; // Used to speed up Mom's Hands
  handPositions = new Map<int, Vector>(); // Used to play an "Appear" animation for Mom's Hands
  diceRoomActivated = false;
  numDDItems = 0;
  megaSatanDead = false;
  endOfRunText = false; // Shown when the run is completed but only for one room
  teleportSubverted = false; // Used for repositioning the player on It Lives! / Gurdy (1/2)
  // Used for repositioning the player on It Lives! / Gurdy (2/2)
  teleportSubvertScale = Vector(1, 1);
  forceMomStomp = false;
  forceMomStompPos = ZERO_VECTOR;
  preventBloodExplosion = false;
  spawningLight = false; // For the custom Crack the Sky effect
  spawningExtraLight = false; // For the custom Crack the Sky effect
  lightPositions: LightDescription[] = []; // For the custom Crack the Sky effect
  // Used to fix the bug where multiple black hearts can drop from the same multi-segment enemy
  blackHeartNPCs = new Map<int, BlackHeartNPC>(); // Keys are NPC indexes
  blackHeartCount = new Map<int, int>(); // Keys are NPC init seeds
  touchedPickup = false; // Used for Challenge Rooms
  matriarch = {
    // Used to rebalance The Matriarch
    spawned: false,
    chubIndex: -1,
    stunFrame: 0,
  };
}
