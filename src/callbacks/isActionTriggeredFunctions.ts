import * as switchForgotten from "../features/mandatory/switchForgotten";

const functionMap = new Map<
  ButtonAction,
  (player: EntityPlayer) => boolean | null
>();
export default functionMap;

functionMap.set(ButtonAction.ACTION_DROP, () => {
  const returnValue = switchForgotten.actionDrop();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});
