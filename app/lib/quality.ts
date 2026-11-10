export type Tier = "static" | "lite" | "full";
/** How much 3D this device gets. `static` means no canvas at all: the HTML page stands alone. */
export function pickTier(): Tier {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    nav.connection?.saveData ||
    !document.createElement("canvas").getContext("webgl2")
  )
    return "static";
  if (
    matchMedia("(max-width: 700px)").matches ||
    (nav.deviceMemory ?? 8) <= 4 ||
    navigator.hardwareConcurrency <= 4
  )
    return "lite";
  return "full";
}
