import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class DamoclesSpikesFix extends ConfigurableModFeature {
  configKey: keyof Config = "DamoclesSpikesFix";
}
