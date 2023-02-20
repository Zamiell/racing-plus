import { Challenge } from "isaac-typescript-definitions";
import { ModFeature } from "isaacscript-common";
import { mod } from "../mod";

export abstract class ChallengeModFeature extends ModFeature {
  abstract challenge: Challenge;

  constructor() {
    super(mod, false);
    this.shouldCallbackMethodsFire = () =>
      Isaac.GetChallenge() === this.challenge;
  }
}
