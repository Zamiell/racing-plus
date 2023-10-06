import type { Challenge } from "isaac-typescript-definitions";
import { isNumber, ModFeature } from "isaacscript-common";
import { mod } from "../mod";

export abstract class ChallengeModFeature extends ModFeature {
  abstract challenge: Challenge | ReadonlySet<Challenge>;

  constructor() {
    super(mod, false);
    this.shouldCallbackMethodsFire = () => {
      const challenge = Isaac.GetChallenge();

      return isNumber(this.challenge)
        ? challenge === this.challenge
        : this.challenge.has(challenge);
    };
  }
}
