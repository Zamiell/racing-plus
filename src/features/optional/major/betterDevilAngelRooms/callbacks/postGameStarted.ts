import g from "../../../../../globals";
import v from "../v";

export default function betterDevilAngelRoomsPostGameStarted(): void {
  resetVars();
}

function resetVars() {
  const startSeed = g.seeds.GetStartSeed();

  for (const key of Object.keys(v.run.seeds)) {
    const property = key as keyof typeof v.run.seeds;
    v.run.seeds[property] = startSeed;
  }
}
