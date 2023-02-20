import { Challenge } from "isaac-typescript-definitions";
import { ModFeature } from "isaacscript-common";
import { mod } from "../mod";

export class ChallengeModFeature extends ModFeature {
  constructor(challenge: Challenge) {
    super(mod);
    this.shouldCallbackMethodsFire = () => Isaac.GetChallenge() === challenge;
  }
}
