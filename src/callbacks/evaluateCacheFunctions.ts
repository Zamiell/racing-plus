import g from "../globals";

const functionMap = new Map<CacheFlag, (player: EntityPlayer) => void>();
export default functionMap;

functionMap.set(CacheFlag.CACHE_SPEED, (player: EntityPlayer) => {
  debugSpeed(player);
});

function debugSpeed(player: EntityPlayer) {
  if (g.run.debugSpeed) {
    player.MoveSpeed = 2;
  }
}
