export * as crawlspace from "./fastTravel/crawlspace";
export * as entity from "./fastTravel/entity";
export * as heavenDoor from "./fastTravel/heavenDoor";
export * as trapdoor from "./fastTravel/trapdoor";

/*

This code needs to be run when the room clears. Make a new callback or something.

else if (
          entity.Variant === EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL
        ) {
          const effect = entity.ToEffect();
          if (effect !== null && effect.State === 1) {
            effect.State = 0;
            effect.GetSprite().Play("Appear", true);
          }
        }

*/