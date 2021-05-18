import * as saveDat from "../saveDat";

export function main(shouldSave: boolean): void {
  if (shouldSave) {
    saveDat.save();
  }
}
