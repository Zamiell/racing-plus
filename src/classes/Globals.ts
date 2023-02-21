import { game } from "isaacscript-common";
import { ChatMessage } from "../types/ChatMessage";
import { RaceData } from "./RaceData";
import { RaceVars } from "./RaceVars";

export class Globals {
  debug = false;

  // Cache some API classes.
  l = game.GetLevel();
  r = game.GetRoom();
  seeds = game.GetSeeds();
  itemPool = game.GetItemPool();

  readonly chatMessages: ChatMessage[] = [];

  /** Race variables that are set via the client communicating with us over a socket. */
  race = new RaceData();

  /** Extra variables for races that are separate from what the client knows about. */
  raceVars = new RaceVars();

  /**
   * Used only for temporary messages like what is used to display the message when the second place
   * racer gets to the first place racer's floor.
   */
  frameLastClientMessageReceived = 0;
}
