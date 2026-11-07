import draft from "./site.json";
// Empty editorial slots accept text later without changing page components.
type Editorial<T> = T extends null
  ? string | null
  : T extends (infer Item)[]
    ? Editorial<Item>[]
    : T extends object
      ? { [Key in keyof T]: Editorial<T[Key]> }
      : T;
const site: Editorial<typeof draft> = draft;
export default site;
