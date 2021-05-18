import debugFunction from "../debugFunction";

const functionMap = new Map<string, (params: string) => void>();
export default functionMap;

functionMap.set("debug", (_params: string) => {
  debugFunction();
});
