import g from "../../../globals";

const MOM_AND_DAD_SOUND_EFFECTS = [
  SoundEffect.SOUND_MOM_AND_DAD_1,
  SoundEffect.SOUND_MOM_AND_DAD_2,
  SoundEffect.SOUND_MOM_AND_DAD_3,
  SoundEffect.SOUND_MOM_AND_DAD_4,
];

export function postNewLevel(): void {
  for (const soundEffect of MOM_AND_DAD_SOUND_EFFECTS) {
    g.sfx.Stop(soundEffect);
  }
}
