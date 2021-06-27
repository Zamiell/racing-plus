import * as switchForgotten from "../features/mandatory/switchForgotten";

const functionMap = new Map<
  ButtonAction,
  (player: EntityPlayer) => boolean | void
>();
export default functionMap;

functionMap.set(ButtonAction.ACTION_DROP, () => {
  return switchForgotten.actionDrop();
});
