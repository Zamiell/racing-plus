import g from "../../globals";

// Manually switch from The Soul to The Forgotten in specific circumstances
export function actionDrop(): boolean | null {
  if (g.run.switchForgotten) {
    g.run.switchForgotten = false;
    return true;
  }

  return null;
}
