import { ModFeature } from "isaacscript-common";
import { mod } from "../mod";

export abstract class MandatoryModFeature extends ModFeature {
  constructor() {
    super(mod, false);
  }
}
