import draft from "./site.json";
// TODO: Diabetes Haven title is unverified (resume says Co-Founder; the About page says Vice President and PR Manager). Do not publish a title until one is chosen.
// TODO: HeadNav, the insulin tracker, and RC vehicles have no screenshots yet. Do not invent them.
// TODO: WireTrace before/after is the landing page against the visualizer until a real redesign pair exists.
// TODO: The gantry bench photo is an unverified lab shot, not confirmed as this robot.
// TODO: Hand-drawn orthographic views are not posted. Confirm the course allows graded work first.
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
