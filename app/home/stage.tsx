"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { pickTier, type Tier } from "../lib/quality";
// The 3D board loads after first paint, and only on devices that should get it.
const Scene = dynamic(() => import("../scene/scene"), { ssr: false });
export default function Stage() {
  const [tier, setTier] = useState<Tier>("static");
  useEffect(() => {
    // Labels are drawn to canvas textures, so the fonts must be ready first.
    document.fonts.ready.then(() => setTier(pickTier()));
    return () => {
      delete document.documentElement.dataset.scene;
    };
  }, []);
  return tier === "static" ? null : <Scene tier={tier} />;
}
